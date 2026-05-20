import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { DataModel, Id } from "./_generated/dataModel";
import { canManageEvents, canViewRegistrations, requireAuth } from "./lib/rbac";
import {
  getTicketQrSigningSecret,
  signTicketQrPayload,
} from "./lib/ticketQr";
import {
  ticketTypeKindValidator,
  userRoleValidator,
} from "./schema";

const registrationStatusValidator = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("waitlisted"),
  v.literal("cancelled")
);

type DbCtx = GenericQueryCtx<DataModel> | GenericMutationCtx<DataModel>;

function generateConfirmationCode(): string {
  const segment = () =>
    Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EVT-${segment()}-${segment()}`;
}

async function computeWaitlistPosition(
  ctx: DbCtx,
  eventId: Id<"events">,
  createdAt: number
): Promise<number> {
  const forEvent = await ctx.db
    .query("registrations")
    .withIndex("by_event", (q) => q.eq("eventId", eventId))
    .collect();
  const ahead = forEvent.filter(
    (r) => r.status === "waitlisted" && r.createdAt < createdAt
  ).length;
  return ahead + 1;
}

export const registerAttendee = mutation({
  args: {
    eventSlug: v.string(),
    ticketTypeId: v.id("ticketTypes"),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    organization: v.optional(v.string()),
    position: v.optional(v.string()),
    /** When true, registration is confirmed immediately (e.g. after payment). */
    paymentCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.eventSlug))
      .unique();

    if (!event || !event.isPublished) {
      throw new Error("Event not found or not open for registration");
    }

    const ticketType = await ctx.db.get(args.ticketTypeId);
    if (!ticketType || ticketType.eventId !== event._id) {
      throw new Error("Invalid ticket type");
    }
    if (!ticketType.isActive) {
      throw new Error("This ticket type is not available");
    }

    const email = args.email.trim().toLowerCase();
    const existingRows = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", event._id))
      .filter((q) => q.eq(q.field("email"), email))
      .collect();
    const existing = existingRows.find((r) => r.status !== "cancelled");
    if (existing) {
      if (existing.status === "waitlisted") {
        throw new Error("This email is already on the waitlist for this event");
      }
      if (existing.status === "pending") {
        throw new Error(
          "This email already has a registration awaiting payment. Complete payment using your confirmation code or contact support."
        );
      }
      throw new Error("This email is already registered for this event");
    }

    const eventHasRoom = event.registeredCount < event.capacity;
    const ticketHasRoom = ticketType.soldCount < ticketType.capacity;
    const hasSpot = eventHasRoom && ticketHasRoom;

    const now = Date.now();
    const confirmationCode = generateConfirmationCode();

    if (hasSpot) {
      const paid = args.paymentCompleted === true;
      const registrationId = await ctx.db.insert("registrations", {
        eventId: event._id,
        ticketTypeId: ticketType._id,
        ticketKind: ticketType.kind,
        fullName: args.fullName.trim(),
        email,
        phone: args.phone.trim(),
        organization: args.organization?.trim() || undefined,
        position: args.position?.trim() || undefined,
        confirmationCode,
        status: paid ? "confirmed" : "pending",
        createdAt: now,
      });

      await ctx.db.patch(ticketType._id, {
        soldCount: ticketType.soldCount + 1,
      });
      await ctx.db.patch(event._id, {
        registeredCount: event.registeredCount + 1,
      });

      return {
        outcome: paid ? ("confirmed" as const) : ("pending" as const),
        registrationId,
        confirmationCode,
        ticketTypeName: ticketType.name,
        eventTitle: event.titleLine2,
      };
    }

    const registrationId = await ctx.db.insert("registrations", {
      eventId: event._id,
      ticketTypeId: ticketType._id,
      ticketKind: ticketType.kind,
      fullName: args.fullName.trim(),
      email,
      phone: args.phone.trim(),
      organization: args.organization?.trim() || undefined,
      position: args.position?.trim() || undefined,
      confirmationCode,
      status: "waitlisted",
      createdAt: now,
    });

    const position = await computeWaitlistPosition(ctx, event._id, now);

    return {
      outcome: "waitlisted" as const,
      registrationId,
      confirmationCode,
      ticketTypeName: ticketType.name,
      eventTitle: event.titleLine2,
      waitlistPosition: position,
    };
  },
});

/** Public self-registration is disabled — admins create staff in the dashboard. */
export const registerStaff = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    password: v.string(),
    role: userRoleValidator,
  },
  handler: async () => {
    throw new Error(
      "Staff accounts must be created by an administrator. Sign in and go to Admin → Staff."
    );
  },
});

export const getByConfirmationCode = query({
  args: { confirmationCode: v.string() },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("registrations")
      .withIndex("by_confirmation", (q) =>
        q.eq("confirmationCode", args.confirmationCode)
      )
      .unique();
    if (!registration) {
      return null;
    }
    const event = await ctx.db.get(registration.eventId);
    const ticketType = await ctx.db.get(registration.ticketTypeId);
    if (!event || !ticketType) {
      return null;
    }
    let waitlistPosition: number | undefined;
    if (registration.status === "waitlisted") {
      waitlistPosition = await computeWaitlistPosition(
        ctx,
        registration.eventId,
        registration.createdAt
      );
    }
    let qrPayload: string | undefined;
    if (registration.status === "confirmed") {
      qrPayload = await signTicketQrPayload(
        registration._id,
        registration.confirmationCode,
        getTicketQrSigningSecret()
      );
    }
    return { registration, event, ticketType, waitlistPosition, qrPayload };
  },
});

export const listByEventAdmin = query({
  args: {
    sessionToken: v.string(),
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canViewRegistrations(user.role)) {
      throw new Error("Forbidden");
    }
    const rows = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    return rows.sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const participantStatsForAdmin = query({
  args: {
    sessionToken: v.string(),
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canViewRegistrations(user.role)) {
      throw new Error("Forbidden");
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      return null;
    }

    const ticketTypes = await ctx.db
      .query("ticketTypes")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const registrations = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const byTicket = ticketTypes
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((ticket) => {
        const forTicket = registrations.filter(
          (r) => r.ticketTypeId === ticket._id
        );
        const pending = forTicket.filter((r) => r.status === "pending").length;
        const confirmed = forTicket.filter(
          (r) => r.status === "confirmed"
        ).length;
        const waitlisted = forTicket.filter(
          (r) => r.status === "waitlisted"
        ).length;
        const cancelled = forTicket.filter(
          (r) => r.status === "cancelled"
        ).length;
        const active = pending + confirmed;

        return {
          ticketTypeId: ticket._id,
          kind: ticket.kind,
          name: ticket.name,
          capacity: ticket.capacity,
          soldCount: ticket.soldCount,
          spotsLeft: Math.max(0, ticket.capacity - ticket.soldCount),
          isActive: ticket.isActive,
          counts: {
            total: forTicket.length,
            pending,
            confirmed,
            waitlisted,
            cancelled,
            active,
          },
        };
      });

    const totals = {
      capacity: ticketTypes.reduce((s, t) => s + t.capacity, 0),
      soldCount: ticketTypes.reduce((s, t) => s + t.soldCount, 0),
      registrations: registrations.length,
      waitlisted: registrations.filter((r) => r.status === "waitlisted")
        .length,
      active: registrations.filter(
        (r) => r.status === "pending" || r.status === "confirmed"
      ).length,
    };

    return {
      event: {
        _id: event._id,
        slug: event.slug,
        titleLine2: event.titleLine2,
        edition: event.edition,
        registeredCount: event.registeredCount,
        capacity: event.capacity,
      },
      byTicket,
      totals,
    };
  },
});

export const listForAdmin = query({
  args: {
    sessionToken: v.string(),
    eventId: v.id("events"),
    status: v.optional(registrationStatusValidator),
    ticketKind: v.optional(ticketTypeKindValidator),
    ticketTypeId: v.optional(v.id("ticketTypes")),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canViewRegistrations(user.role)) {
      throw new Error("Forbidden");
    }

    const event = await ctx.db.get(args.eventId);
    if (!event) {
      return [];
    }

    let rows = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    if (args.status) {
      rows = rows.filter((r) => r.status === args.status);
    }
    if (args.ticketTypeId) {
      rows = rows.filter((r) => r.ticketTypeId === args.ticketTypeId);
    } else if (args.ticketKind) {
      rows = rows.filter((r) => r.ticketKind === args.ticketKind);
    }

    const ticketTypes = await ctx.db
      .query("ticketTypes")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    const ticketById = new Map(ticketTypes.map((t) => [t._id, t]));

    const enriched = rows
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((r) => {
        const ticket = ticketById.get(r.ticketTypeId);
        return {
          ...r,
          ticketTypeName: ticket?.name ?? r.ticketKind,
          eventSlug: event.slug,
        };
      });

    return enriched;
  },
});

/** Admin: move a waitlisted attendee into a real slot when capacity allows. */
export const promoteWaitlistedRegistration = mutation({
  args: {
    sessionToken: v.string(),
    registrationId: v.id("registrations"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canManageEvents(user.role)) {
      throw new Error("Forbidden");
    }
    const registration = await ctx.db.get(args.registrationId);
    if (!registration || registration.status !== "waitlisted") {
      throw new Error("Registration is not on the waitlist");
    }
    const event = await ctx.db.get(registration.eventId);
    const ticketType = await ctx.db.get(registration.ticketTypeId);
    if (!event || !ticketType) {
      throw new Error("Event or ticket type not found");
    }
    const eventHasRoom = event.registeredCount < event.capacity;
    const ticketHasRoom = ticketType.soldCount < ticketType.capacity;
    if (!eventHasRoom || !ticketHasRoom) {
      throw new Error("No capacity available to promote this registration");
    }
    await ctx.db.patch(registration._id, {
      status: "pending",
    });
    await ctx.db.patch(ticketType._id, {
      soldCount: ticketType.soldCount + 1,
    });
    await ctx.db.patch(event._id, {
      registeredCount: event.registeredCount + 1,
    });
    return { ok: true as const };
  },
});
