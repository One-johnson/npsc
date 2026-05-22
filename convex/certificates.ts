import type { GenericMutationCtx } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { DataModel, Id } from "./_generated/dataModel";
import { canManageEvents, canViewRegistrations, requireAuth } from "./lib/rbac";

type MutationCtx = GenericMutationCtx<DataModel>;

async function nextCertificateNumber(
  ctx: MutationCtx,
  eventId: Id<"events">,
  edition: string
): Promise<string> {
  const existing = await ctx.db
    .query("certificates")
    .withIndex("by_event", (q) => q.eq("eventId", eventId))
    .collect();
  const seq = existing.length + 1;
  const year = edition.replace(/\D/g, "").slice(-4) || "2026";
  return `NPSC-${year}-${String(seq).padStart(5, "0")}`;
}

/** Public: certificate status for a registration reference code. */
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
    const cert = await ctx.db
      .query("certificates")
      .withIndex("by_registration", (q) =>
        q.eq("registrationId", registration._id)
      )
      .unique();
    if (!cert || cert.revokedAt) {
      return null;
    }
    return {
      certificateNumber: cert.certificateNumber,
      issuedAt: cert.issuedAt,
    };
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
    const certs = await ctx.db
      .query("certificates")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    return certs
      .filter((c) => !c.revokedAt)
      .map((c) => ({
        registrationId: c.registrationId,
        certificateNumber: c.certificateNumber,
        issuedAt: c.issuedAt,
      }));
  },
});

/** Admin: issue certificate of attendance for a confirmed registration. */
export const issue = mutation({
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
    if (!registration) {
      throw new Error("Registration not found");
    }
    if (registration.status !== "confirmed") {
      throw new Error("Only confirmed registrations can receive a certificate");
    }
    const event = await ctx.db.get(registration.eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    const existing = await ctx.db
      .query("certificates")
      .withIndex("by_registration", (q) =>
        q.eq("registrationId", registration._id)
      )
      .unique();
    if (existing && !existing.revokedAt) {
      return {
        ok: true as const,
        alreadyIssued: true as const,
        certificateNumber: existing.certificateNumber,
      };
    }
    const now = Date.now();
    const certificateNumber = await nextCertificateNumber(
      ctx,
      event._id,
      event.edition
    );
    if (existing?.revokedAt) {
      await ctx.db.patch(existing._id, {
        certificateNumber,
        issuedAt: now,
        issuedByUserId: user._id,
        revokedAt: undefined,
      });
      return {
        ok: true as const,
        alreadyIssued: false as const,
        certificateNumber,
      };
    }
    await ctx.db.insert("certificates", {
      registrationId: registration._id,
      eventId: event._id,
      certificateNumber,
      issuedAt: now,
      issuedByUserId: user._id,
    });
    return {
      ok: true as const,
      alreadyIssued: false as const,
      certificateNumber,
    };
  },
});

/** Admin: revoke a issued certificate. */
export const revoke = mutation({
  args: {
    sessionToken: v.string(),
    registrationId: v.id("registrations"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canManageEvents(user.role)) {
      throw new Error("Forbidden");
    }
    const cert = await ctx.db
      .query("certificates")
      .withIndex("by_registration", (q) =>
        q.eq("registrationId", args.registrationId)
      )
      .unique();
    if (!cert || cert.revokedAt) {
      throw new Error("No active certificate for this registration");
    }
    await ctx.db.patch(cert._id, { revokedAt: Date.now() });
    return { ok: true as const };
  },
});
