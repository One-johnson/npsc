export type PublicEventInfo = {
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
};

export type TicketTypeOption = {
  /** Convex `ticketTypes` id, or `mock-{kind}` when using fallback data. */
  id: string;
  kind: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  capacity: number;
  soldCount: number;
  perks: string[];
  isActive: boolean;
  sortOrder: number;
};

export type PublicEventBundle = {
  event: PublicEventInfo;
  ticketTypes: TicketTypeOption[];
  /** When true, registrations are stored in Convex. */
  isLive: boolean;
};
