import type { MockEvent } from "@/lib/mock-event";
import type { PublicEventBundle, TicketTypeOption } from "@/lib/event/types";
import { filterSelfServiceTicketTypes } from "@/lib/ticket-types/public-registration";

/** Matches seeded ticket kinds when Convex has no data yet. */
const FALLBACK_KINDS: Omit<
  TicketTypeOption,
  "id" | "soldCount" | "capacity"
>[] = [
  {
    kind: "participant",
    slug: "participant",
    name: "Participant / Delegate",
    description:
      "Full conference access for procurement and supply professionals.",
    price: 1500,
    currency: "GHS",
    perks: [
      "Full 2-day access",
      "Lunch on both days",
      "Exhibition hall access",
      "Certificate of attendance",
    ],
    isActive: true,
    sortOrder: 0,
  },
  {
    kind: "vip",
    slug: "vip",
    name: "International Delegate",
    description: "Full conference access for delegates travelling from outside Ghana.",
    price: 1200,
    currency: "GHS",
    perks: ["Full 2-day access", "Priority registration desk", "International networking session"],
    isActive: true,
    sortOrder: 1,
  },
  {
    kind: "sponsor",
    slug: "sponsor",
    name: "Sponsor",
    description: "Sponsor representative passes.",
    price: 0,
    currency: "GHS",
    perks: ["Brand visibility", "Exhibition priority"],
    isActive: true,
    sortOrder: 2,
  },
  {
    kind: "exhibitor",
    slug: "exhibitor",
    name: "Exhibition Package",
    description:
      "Two-day exhibition package. Space allocation only — branding and booth customization excluded.",
    price: 5000,
    currency: "GHS",
    perks: [
      "One exhibition booth",
      "Meals for one representative",
      "One table and two chairs",
      "Space allocation only (branding and booth customization excluded)",
    ],
    isActive: true,
    sortOrder: 3,
  },
  {
    kind: "student",
    slug: "student",
    name: "Student",
    description:
      "Student pass for enrolled students (GHS 200). Upload a valid student ID when registering.",
    price: 200,
    currency: "GHS",
    perks: [
      "Full 2-day access",
      "Student networking session",
      "Certificate of attendance",
    ],
    isActive: true,
    sortOrder: 4,
  },
  {
    kind: "media",
    slug: "media",
    name: "Media",
    description: "Accredited press and media representatives.",
    price: 0,
    currency: "GHS",
    perks: ["Press gallery access", "Media kit"],
    isActive: true,
    sortOrder: 5,
  },
];

export function buildFallbackBundle(event: MockEvent): PublicEventBundle {
  const ticketTypes: TicketTypeOption[] = filterSelfServiceTicketTypes(
    FALLBACK_KINDS
  ).map((t) => ({
    ...t,
    id: `mock-${t.kind}`,
    capacity: 500,
    soldCount: 0,
  }));

  return {
    event: {
      slug: event.slug,
      edition: event.edition,
      title: event.title,
      titleLine2: event.titleLine2,
      subtitle: event.subtitle,
      tagline: event.tagline,
      date: event.date,
      dateShort: event.dateShort,
      time: event.time,
      venue: event.venue,
      city: event.city,
      country: event.country,
      website: event.website,
      heroImage: event.heroImage,
      capacity: event.capacity,
      registeredCount: event.registeredCount,
      about: event.about,
    },
    ticketTypes,
    isLive: false,
  };
}
