import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const userRoleValidator = v.union(
  v.literal("admin"),
  v.literal("finance")
);

export const ticketTypeKindValidator = v.union(
  v.literal("participant"),
  v.literal("vip"),
  v.literal("speaker"),
  v.literal("sponsor"),
  v.literal("exhibitor"),
  v.literal("student"),
  v.literal("media")
);

export const paymentMethodValidator = v.union(
  v.literal("momo"),
  v.literal("card"),
  v.literal("bank"),
  v.literal("other")
);

export const paymentProviderValidator = v.union(
  v.literal("mock"),
  v.literal("manual"),
  v.literal("hubtel")
);

export const paymentStatusValidator = v.union(
  v.literal("completed"),
  v.literal("failed"),
  v.literal("refunded")
);

const organizerValidator = v.object({
  name: v.string(),
  logo: v.string(),
});

const agendaItemValidator = v.object({
  time: v.string(),
  title: v.string(),
  speaker: v.optional(v.string()),
});

const featureValidator = v.object({
  icon: v.string(),
  title: v.string(),
  description: v.string(),
});

const audienceValidator = v.object({
  id: v.string(),
  title: v.string(),
  description: v.string(),
});

const stepValidator = v.object({
  step: v.number(),
  title: v.string(),
  description: v.string(),
});

const faqValidator = v.object({
  question: v.string(),
  answer: v.string(),
});

const partnerValidator = v.object({
  id: v.string(),
  name: v.string(),
  logo: v.string(),
});

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    /** Phone or other contact detail */
    contact: v.optional(v.string()),
    /** Staff login ID, e.g. npsc4827 */
    staffId: v.optional(v.string()),
    passwordHash: v.string(),
    role: userRoleValidator,
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_staff_id", ["staffId"]),

  sessions: defineTable({
    userId: v.id("users"),
    tokenHash: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    lastUsedAt: v.number(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  })
    .index("by_token_hash", ["tokenHash"])
    .index("by_user", ["userId"]),

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  events: defineTable({
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
    heroImage: v.string(),
    capacity: v.number(),
    registeredCount: v.number(),
    about: v.string(),
    isPublished: v.boolean(),
    organizers: v.array(organizerValidator),
    agenda: v.array(agendaItemValidator),
    features: v.array(featureValidator),
    audiences: v.array(audienceValidator),
    steps: v.array(stepValidator),
    faqs: v.array(faqValidator),
    partners: v.array(partnerValidator),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_organization", ["organizationId"]),

  ticketTypes: defineTable({
    eventId: v.id("events"),
    slug: v.string(),
    kind: ticketTypeKindValidator,
    name: v.string(),
    description: v.string(),
    price: v.number(),
    currency: v.string(),
    capacity: v.number(),
    soldCount: v.number(),
    perks: v.array(v.string()),
    isActive: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_event_slug", ["eventId", "slug"]),

  registrations: defineTable({
    eventId: v.id("events"),
    ticketTypeId: v.id("ticketTypes"),
    ticketKind: ticketTypeKindValidator,
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    organization: v.optional(v.string()),
    position: v.optional(v.string()),
    /** Uploaded student ID card (student pass only). */
    studentIdStorageId: v.optional(v.id("_storage")),
    confirmationCode: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("waitlisted"),
      v.literal("cancelled")
    ),
    createdAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_confirmation", ["confirmationCode"])
    .index("by_event_email", ["eventId", "email"]),

  payments: defineTable({
    registrationId: v.id("registrations"),
    eventId: v.id("events"),
    amount: v.number(),
    currency: v.string(),
    method: paymentMethodValidator,
    provider: paymentProviderValidator,
    status: paymentStatusValidator,
    externalReference: v.optional(v.string()),
    recordedByUserId: v.optional(v.id("users")),
    paidAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_registration", ["registrationId"])
    .index("by_event", ["eventId"])
    .index("by_event_paid_at", ["eventId", "paidAt"]),

  certificates: defineTable({
    registrationId: v.id("registrations"),
    eventId: v.id("events"),
    certificateNumber: v.string(),
    issuedAt: v.number(),
    issuedByUserId: v.id("users"),
    revokedAt: v.optional(v.number()),
  })
    .index("by_registration", ["registrationId"])
    .index("by_event", ["eventId"]),
});
