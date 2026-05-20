import type { MockEvent, TicketTier } from "@/lib/mock-event";

type ConvexPublicEvent = {
  event: {
    slug: string;
    edition: string;
    title: string;
    titleLine2: string;
    subtitle: string;
    tagline: string;
    date: string;
    dateShort: string;
    time: string;
    venue: string;
    city: string;
    country: string;
    website: string;
    heroImage: string;
    capacity: number;
    registeredCount: number;
    about: string;
    organizers: { name: string; logo: string }[];
    agenda: { time: string; title: string; speaker?: string }[];
    features: { icon: string; title: string; description: string }[];
    audiences: MockEvent["audiences"];
    steps: MockEvent["steps"];
    faqs: MockEvent["faqs"];
    partners: MockEvent["partners"];
  };
  ticketTypes: {
    slug: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    perks: string[];
  }[];
};

export function mapConvexEventToMockShape(data: ConvexPublicEvent): MockEvent {
  const { event, ticketTypes } = data;
  const tiers: TicketTier[] = ticketTypes.map((t) => ({
    id: t.slug,
    name: t.name,
    description: t.description,
    price: t.price,
    currency: t.currency,
    perks: t.perks,
  }));

  const registrationFee =
    tiers.find((t) => t.id === "participant")?.price ??
    tiers[0]?.price ??
    0;

  return {
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
    registrationFee,
    registrationCurrency: tiers[0]?.currency ?? "GHS",
    about: event.about,
    organizers: event.organizers,
    agenda: event.agenda,
    tiers,
    features: event.features as MockEvent["features"],
    audiences: event.audiences,
    steps: event.steps,
    faqs: event.faqs,
    partners: event.partners,
  };
}
