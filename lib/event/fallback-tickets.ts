import type { MockEvent } from "@/lib/mock-event";
import type { PublicEventBundle, TicketTypeOption } from "@/lib/event/types";

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
    price: 500,
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
    name: "VIP Delegate",
    description: "Premium access with priority seating and networking.",
    price: 1200,
    currency: "GHS",
    perks: ["VIP lounge access", "Priority seating", "Exclusive networking"],
    isActive: true,
    sortOrder: 1,
  },
  {
    kind: "speaker",
    slug: "speaker",
    name: "Speaker",
    description: "Complimentary pass for confirmed session speakers.",
    price: 0,
    currency: "GHS",
    perks: ["Speaker green room", "Full conference access"],
    isActive: true,
    sortOrder: 2,
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
    sortOrder: 3,
  },
  {
    kind: "exhibitor",
    slug: "exhibitor",
    name: "Exhibitor",
    description: "Exhibition booth staff passes.",
    price: 1500,
    currency: "GHS",
    perks: ["Exhibition booth space", "2 staff passes"],
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
  const ticketTypes: TicketTypeOption[] = FALLBACK_KINDS.map((t) => ({
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
