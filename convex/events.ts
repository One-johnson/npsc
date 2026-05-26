import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id, DataModel } from "./_generated/dataModel";
import type { GenericMutationCtx } from "convex/server";
import type { GenericId } from "convex/values";
import { DEFAULT_HERO_IMAGE, EMPTY_EVENT_CONTENT } from "./lib/eventDefaults";
import { filterSelfServiceTicketTypes } from "./lib/publicRegistration";
import { canManageEvents, requireAuth } from "./lib/rbac";

type MutationCtx = GenericMutationCtx<DataModel>;

async function resolveHeroImage(
  ctx: MutationCtx,
  heroStorageId: GenericId<"_storage"> | undefined,
  heroImage: string | undefined
): Promise<string> {
  if (heroStorageId) {
    const url = await ctx.storage.getUrl(heroStorageId);
    if (!url) {
      throw new Error("Uploaded image not found");
    }
    return url;
  }
  return heroImage?.trim() || DEFAULT_HERO_IMAGE;
}

async function deleteEventCascade(ctx: MutationCtx, eventId: Id<"events">) {
  const ticketTypes = await ctx.db
    .query("ticketTypes")
    .withIndex("by_event", (q) => q.eq("eventId", eventId))
    .collect();
  for (const ticketType of ticketTypes) {
    await ctx.db.delete(ticketType._id);
  }

  const registrations = await ctx.db
    .query("registrations")
    .withIndex("by_event", (q) => q.eq("eventId", eventId))
    .collect();
  for (const registration of registrations) {
    await ctx.db.delete(registration._id);
  }

  await ctx.db.delete(eventId);
}

const eventContentValidator = {
  organizers: v.array(
    v.object({ name: v.string(), logo: v.string() })
  ),
  agenda: v.array(
    v.object({
      time: v.string(),
      title: v.string(),
      speaker: v.optional(v.string()),
    })
  ),
  features: v.array(
    v.object({
      icon: v.string(),
      title: v.string(),
      description: v.string(),
    })
  ),
  audiences: v.array(
    v.object({
      id: v.string(),
      title: v.string(),
      description: v.string(),
    })
  ),
  steps: v.array(
    v.object({
      step: v.number(),
      title: v.string(),
      description: v.string(),
    })
  ),
  faqs: v.array(
    v.object({ question: v.string(), answer: v.string() })
  ),
  partners: v.array(
    v.object({ id: v.string(), name: v.string(), logo: v.string() })
  ),
};

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!event || !event.isPublished) {
      return null;
    }
    const ticketTypes = await ctx.db
      .query("ticketTypes")
      .withIndex("by_event", (q) => q.eq("eventId", event._id))
      .collect();
    const activeTickets = filterSelfServiceTicketTypes(
      ticketTypes.filter((t) => t.isActive)
    ).sort((a, b) => a.sortOrder - b.sortOrder);
    return { event, ticketTypes: activeTickets };
  },
});

export const getBySlugAdmin = query({
  args: { sessionToken: v.string(), slug: v.string() },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.sessionToken);
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!event) {
      return null;
    }
    const ticketTypes = await ctx.db
      .query("ticketTypes")
      .withIndex("by_event", (q) => q.eq("eventId", event._id))
      .collect();
    return {
      event,
      ticketTypes: ticketTypes.sort((a, b) => a.sortOrder - b.sortOrder),
    };
  },
});

export const list = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.sessionToken);
    const events = await ctx.db.query("events").collect();
    return events.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("events").collect();
    return events
      .filter((e) => e.isPublished)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

/** Slug for the current public site when multiple editions are published (most recently updated). */
export const getDefaultPublishedSlug = query({
  args: {},
  handler: async (ctx) => {
    const published = await ctx.db
      .query("events")
      .collect()
      .then((events) =>
        events
          .filter((e) => e.isPublished)
          .sort((a, b) => b.updatedAt - a.updatedAt)
      );
    return published[0]?.slug ?? null;
  },
});

export const getById = query({
  args: { sessionToken: v.string(), eventId: v.id("events") },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.sessionToken);
    return await ctx.db.get(args.eventId);
  },
});

export const listOrganizations = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.sessionToken);
    const orgs = await ctx.db.query("organizations").collect();
    return orgs.sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const create = mutation({
  args: {
    sessionToken: v.string(),
    organizationId: v.id("organizations"),
    slug: v.string(),
    edition: v.string(),
    title: v.string(),
    titleLine2: v.string(),
    subtitle: v.string(),
    tagline: v.string(),
    date: v.string(),
    dateShort: v.string(),
    time: v.string(),
    venue: v.string(),
    city: v.string(),
    country: v.string(),
    website: v.string(),
    heroImage: v.optional(v.string()),
    heroStorageId: v.optional(v.id("_storage")),
    capacity: v.number(),
    about: v.string(),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canManageEvents(user.role)) {
      throw new Error("Forbidden");
    }

    const org = await ctx.db.get(args.organizationId);
    if (!org) {
      throw new Error("Organization not found");
    }

    const slug = args.slug.trim().toLowerCase();
    const existing = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) {
      throw new Error("An event with this slug already exists");
    }

    const now = Date.now();
    const heroImage = await resolveHeroImage(
      ctx,
      args.heroStorageId,
      args.heroImage
    );

    return await ctx.db.insert("events", {
      organizationId: args.organizationId,
      slug,
      edition: args.edition.trim(),
      title: args.title.trim(),
      titleLine2: args.titleLine2.trim(),
      subtitle: args.subtitle.trim(),
      tagline: args.tagline.trim(),
      date: args.date.trim(),
      dateShort: args.dateShort.trim(),
      time: args.time.trim(),
      venue: args.venue.trim(),
      city: args.city.trim(),
      country: args.country.trim(),
      website: args.website.trim(),
      heroImage,
      capacity: args.capacity,
      registeredCount: 0,
      about: args.about.trim(),
      isPublished: args.isPublished,
      ...EMPTY_EVENT_CONTENT,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/** Copy an edition for the next year: new event id, ticket types reset, registrations not copied. */
export const duplicate = mutation({
  args: {
    sessionToken: v.string(),
    sourceEventId: v.id("events"),
    newSlug: v.string(),
    edition: v.optional(v.string()),
    date: v.optional(v.string()),
    dateShort: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    unpublishSource: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canManageEvents(user.role)) {
      throw new Error("Forbidden");
    }

    const source = await ctx.db.get(args.sourceEventId);
    if (!source) {
      throw new Error("Source event not found");
    }

    const slug = args.newSlug.trim().toLowerCase();
    const slugTaken = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (slugTaken) {
      throw new Error("An event with this slug already exists");
    }

    const now = Date.now();
    const newEventId = await ctx.db.insert("events", {
      organizationId: source.organizationId,
      slug,
      edition: (args.edition ?? source.edition).trim(),
      title: source.title,
      titleLine2: source.titleLine2,
      subtitle: source.subtitle,
      tagline: source.tagline,
      date: (args.date ?? source.date).trim(),
      dateShort: (args.dateShort ?? source.dateShort).trim(),
      time: source.time,
      venue: source.venue,
      city: source.city,
      country: source.country,
      website: source.website,
      heroImage: source.heroImage,
      capacity: source.capacity,
      registeredCount: 0,
      about: source.about,
      isPublished: args.isPublished ?? false,
      organizers: source.organizers,
      agenda: source.agenda,
      features: source.features,
      audiences: source.audiences,
      steps: source.steps,
      faqs: source.faqs,
      partners: source.partners,
      createdAt: now,
      updatedAt: now,
    });

    const ticketTypes = await ctx.db
      .query("ticketTypes")
      .withIndex("by_event", (q) => q.eq("eventId", source._id))
      .collect();

    let ticketTypesCopied = 0;
    for (const ticket of ticketTypes) {
      await ctx.db.insert("ticketTypes", {
        eventId: newEventId,
        slug: ticket.slug,
        kind: ticket.kind,
        name: ticket.name,
        description: ticket.description,
        price: ticket.price,
        currency: ticket.currency,
        capacity: ticket.capacity,
        soldCount: 0,
        perks: ticket.perks,
        isActive: ticket.isActive,
        sortOrder: ticket.sortOrder,
        createdAt: now,
        updatedAt: now,
      });
      ticketTypesCopied += 1;
    }

    if (args.unpublishSource && source.isPublished) {
      await ctx.db.patch(source._id, {
        isPublished: false,
        updatedAt: now,
      });
    }

    return {
      eventId: newEventId,
      slug,
      ticketTypesCopied,
      sourceSlug: source.slug,
    };
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    eventId: v.id("events"),
    edition: v.optional(v.string()),
    title: v.optional(v.string()),
    titleLine2: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    tagline: v.optional(v.string()),
    date: v.optional(v.string()),
    dateShort: v.optional(v.string()),
    time: v.optional(v.string()),
    venue: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
    website: v.optional(v.string()),
    heroImage: v.optional(v.string()),
    heroStorageId: v.optional(v.id("_storage")),
    capacity: v.optional(v.number()),
    about: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    ...eventContentValidator,
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canManageEvents(user.role)) {
      throw new Error("Forbidden");
    }
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const { sessionToken: _, eventId, heroStorageId, heroImage, ...rest } = args;
    const filtered = Object.fromEntries(
      Object.entries(rest).filter(([, value]) => value !== undefined)
    );

    let resolvedHero: string | undefined;
    if (heroStorageId !== undefined || heroImage !== undefined) {
      resolvedHero = await resolveHeroImage(ctx, heroStorageId, heroImage);
    }

    await ctx.db.patch(eventId, {
      ...filtered,
      ...(resolvedHero !== undefined ? { heroImage: resolvedHero } : {}),
      updatedAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    sessionToken: v.string(),
    eventId: v.id("events"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canManageEvents(user.role)) {
      throw new Error("Forbidden");
    }
    const event = await ctx.db.get(args.eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    await deleteEventCascade(ctx, args.eventId);
    return { ok: true as const };
  },
});

export const bulkDelete = mutation({
  args: {
    sessionToken: v.string(),
    eventIds: v.array(v.id("events")),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canManageEvents(user.role)) {
      throw new Error("Forbidden");
    }
    if (args.eventIds.length === 0) {
      return { deleted: 0 };
    }

    let deleted = 0;
    for (const eventId of args.eventIds) {
      const event = await ctx.db.get(eventId);
      if (!event) {
        continue;
      }
      await deleteEventCascade(ctx, eventId);
      deleted += 1;
    }

    return { deleted };
  },
});

export const dashboardStats = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.sessionToken);
    const events = await ctx.db.query("events").collect();
    const ticketTypes = await ctx.db.query("ticketTypes").collect();
    const totalCapacity = ticketTypes.reduce((sum, t) => sum + t.capacity, 0);
    const totalSold = ticketTypes.reduce((sum, t) => sum + t.soldCount, 0);
    const users = await ctx.db.query("users").collect();
    return {
      eventCount: events.length,
      publishedEventCount: events.filter((e) => e.isPublished).length,
      ticketTypeCount: ticketTypes.length,
      totalCapacity,
      totalSold,
      staffCount: users.length,
    };
  },
});
