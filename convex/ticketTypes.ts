import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { canManageEvents, requireAuth } from "./lib/rbac";
import { ticketTypeKindValidator } from "./schema";

export const listByEvent = query({
  args: {
    sessionToken: v.string(),
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.sessionToken);
    const types = await ctx.db
      .query("ticketTypes")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    return types.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const create = mutation({
  args: {
    sessionToken: v.string(),
    eventId: v.id("events"),
    slug: v.string(),
    kind: ticketTypeKindValidator,
    name: v.string(),
    description: v.string(),
    price: v.number(),
    currency: v.string(),
    capacity: v.number(),
    perks: v.array(v.string()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canManageEvents(user.role)) {
      throw new Error("Forbidden");
    }
    const existing = await ctx.db
      .query("ticketTypes")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .filter((q) => q.eq(q.field("slug"), args.slug))
      .unique();
    if (existing) {
      throw new Error("Ticket type slug already exists for this event");
    }
    const siblings = await ctx.db
      .query("ticketTypes")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();
    const now = Date.now();
    return await ctx.db.insert("ticketTypes", {
      eventId: args.eventId,
      slug: args.slug,
      kind: args.kind,
      name: args.name,
      description: args.description,
      price: args.price,
      currency: args.currency,
      capacity: args.capacity,
      soldCount: 0,
      perks: args.perks,
      isActive: true,
      sortOrder: args.sortOrder ?? siblings.length,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    ticketTypeId: v.id("ticketTypes"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    capacity: v.optional(v.number()),
    perks: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
    sortOrder: v.optional(v.number()),
    kind: v.optional(ticketTypeKindValidator),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canManageEvents(user.role)) {
      throw new Error("Forbidden");
    }
    const ticket = await ctx.db.get(args.ticketTypeId);
    if (!ticket) {
      throw new Error("Ticket type not found");
    }
    if (
      args.capacity !== undefined &&
      args.capacity < ticket.soldCount
    ) {
      throw new Error("Capacity cannot be less than sold count");
    }
    const { sessionToken: _, ticketTypeId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );
    await ctx.db.patch(ticketTypeId, {
      ...filtered,
      updatedAt: Date.now(),
    });
  },
});
