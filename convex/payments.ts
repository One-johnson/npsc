import type { GenericMutationCtx } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { DataModel, Id } from "./_generated/dataModel";
import {
  paymentMethodValidator,
  paymentProviderValidator,
} from "./schema";
import { canViewPayments, requireAuth } from "./lib/rbac";

async function confirmRegistrationAndRecordPayment(
  ctx: GenericMutationCtx<DataModel>,
  args: {
    confirmationCode: string;
    amount: number;
    currency: string;
    method: "momo" | "card" | "bank" | "other";
    provider: "mock" | "manual" | "hubtel";
    externalReference?: string;
    recordedByUserId?: Id<"users">;
  }
) {
  const registration = await ctx.db
    .query("registrations")
    .withIndex("by_confirmation", (q) =>
      q.eq("confirmationCode", args.confirmationCode)
    )
    .unique();

  if (!registration) {
    throw new Error("Registration not found");
  }

  if (registration.status === "confirmed") {
    const existingPayment = await ctx.db
      .query("payments")
      .withIndex("by_registration", (q) =>
        q.eq("registrationId", registration._id)
      )
      .first();
    return {
      ok: true as const,
      alreadyConfirmed: true as const,
      confirmationCode: registration.confirmationCode,
      paymentId: existingPayment?._id ?? null,
    };
  }

  if (registration.status !== "pending") {
    throw new Error(
      "Only pending registrations awaiting payment can be confirmed."
    );
  }

  const now = Date.now();
  const paymentId = await ctx.db.insert("payments", {
    registrationId: registration._id,
    eventId: registration.eventId,
    amount: args.amount,
    currency: args.currency,
    method: args.method,
    provider: args.provider,
    status: "completed",
    externalReference: args.externalReference,
    recordedByUserId: args.recordedByUserId,
    paidAt: now,
    createdAt: now,
  });

  await ctx.db.patch(registration._id, { status: "confirmed" });

  const event = await ctx.db.get(registration.eventId);
  const ticketType = await ctx.db.get(registration.ticketTypeId);

  return {
    ok: true as const,
    alreadyConfirmed: false as const,
    confirmationCode: registration.confirmationCode,
    paymentId,
    eventTitle: event?.titleLine2 ?? "",
    ticketTypeName: ticketType?.name ?? registration.ticketKind,
  };
}

/** Public: complete payment and confirm registration (mock / future Hubtel callback). */
export const completeRegistrationPayment = mutation({
  args: {
    confirmationCode: v.string(),
    amount: v.number(),
    currency: v.string(),
    method: paymentMethodValidator,
    provider: paymentProviderValidator,
    externalReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.provider === "manual") {
      throw new Error("Manual payments must be recorded by staff.");
    }
    return confirmRegistrationAndRecordPayment(ctx, args);
  },
});

/** Backward-compatible alias — infers amount from ticket type when omitted. */
export const confirmRegistrationPayment = mutation({
  args: {
    confirmationCode: v.string(),
    amount: v.optional(v.number()),
    currency: v.optional(v.string()),
    method: v.optional(paymentMethodValidator),
    provider: v.optional(paymentProviderValidator),
    externalReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const registration = await ctx.db
      .query("registrations")
      .withIndex("by_confirmation", (q) =>
        q.eq("confirmationCode", args.confirmationCode)
      )
      .unique();
    if (!registration) {
      throw new Error("Registration not found");
    }
    const ticketType = await ctx.db.get(registration.ticketTypeId);
    return confirmRegistrationAndRecordPayment(ctx, {
      confirmationCode: args.confirmationCode,
      amount: args.amount ?? ticketType?.price ?? 0,
      currency: args.currency ?? ticketType?.currency ?? "GHS",
      method: args.method ?? "momo",
      provider: args.provider ?? "mock",
      externalReference: args.externalReference,
    });
  },
});

/** Admin/Finance: record bank or manual MoMo and confirm a pending registration. */
export const recordManualPayment = mutation({
  args: {
    sessionToken: v.string(),
    confirmationCode: v.string(),
    amount: v.number(),
    currency: v.string(),
    method: paymentMethodValidator,
    externalReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canViewPayments(user.role)) {
      throw new Error("Forbidden");
    }
    return confirmRegistrationAndRecordPayment(ctx, {
      confirmationCode: args.confirmationCode,
      amount: args.amount,
      currency: args.currency,
      method: args.method,
      provider: "manual",
      externalReference: args.externalReference,
      recordedByUserId: user._id,
    });
  },
});

export const listForAdmin = query({
  args: {
    sessionToken: v.string(),
    eventId: v.optional(v.id("events")),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canViewPayments(user.role)) {
      throw new Error("Forbidden");
    }

    let payments = args.eventId
      ? await ctx.db
          .query("payments")
          .withIndex("by_event", (q) => q.eq("eventId", args.eventId!))
          .collect()
      : await ctx.db.query("payments").collect();

    payments = payments.sort((a, b) => b.paidAt - a.paidAt);

    const enriched = await Promise.all(
      payments.map(async (p) => {
        const registration = await ctx.db.get(p.registrationId);
        const ticketType = registration
          ? await ctx.db.get(registration.ticketTypeId)
          : null;
        const event = await ctx.db.get(p.eventId);
        const recordedBy = p.recordedByUserId
          ? await ctx.db.get(p.recordedByUserId)
          : null;
        return {
          ...p,
          attendeeName: registration?.fullName ?? "—",
          attendeeEmail: registration?.email ?? "—",
          confirmationCode: registration?.confirmationCode ?? "—",
          registrationStatus: registration?.status,
          ticketTypeName: ticketType?.name ?? "—",
          eventSlug: event?.slug ?? "",
          eventTitle: event?.titleLine2 ?? "",
          recordedByName: recordedBy?.name,
        };
      })
    );

    return enriched;
  },
});

export const listPendingForAdmin = query({
  args: {
    sessionToken: v.string(),
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canViewPayments(user.role)) {
      throw new Error("Forbidden");
    }

    const rows = await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const pending = rows.filter((r) => r.status === "pending");
    const enriched = await Promise.all(
      pending.map(async (r) => {
        const ticketType = await ctx.db.get(r.ticketTypeId);
        return {
          ...r,
          ticketTypeName: ticketType?.name ?? r.ticketKind,
          price: ticketType?.price ?? 0,
          currency: ticketType?.currency ?? "GHS",
        };
      })
    );

    return enriched.sort((a, b) => a.createdAt - b.createdAt);
  },
});
