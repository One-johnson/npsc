export type TicketTier = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  perks: string[];
};

export type EventFeature = {
  icon: "zap" | "shield" | "users" | "award" | "credit-card";
  title: string;
  description: string;
};

export type AudienceSegment = {
  id: string;
  title: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type EventPartner = {
  id: string;
  name: string;
  logo: string;
};

export type EventStep = {
  step: number;
  title: string;
  description: string;
};

export type MockEvent = {
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
  registrationFee: number;
  registrationCurrency: string;
  about: string;
  organizers: { name: string; logo: string }[];
  agenda: { time: string; title: string; speaker?: string }[];
  tiers: TicketTier[];
  features: EventFeature[];
  audiences: AudienceSegment[];
  steps: EventStep[];
  faqs: FaqItem[];
  partners: EventPartner[];
};

export const mockEvent: MockEvent = {
  slug: "npsc-2026",
  edition: "RETURNS",
  title: "Ghana's Premier",
  titleLine2: "Procurement & Supply Chain Conference",
  subtitle: "National Procurement & Supply Conference",
  tagline:
    "Join procurement leaders, supply chain professionals, and policy makers for two days of insight, networking, and innovation at UPSA Auditorium, Accra.",
  date: "2–3 September 2026",
  dateShort: "2–3 SEPT 2026",
  time: "8:30 AM – 5:00 PM daily",
  venue: "UPSA Auditorium",
  city: "Accra",
  country: "Ghana",
  website: "www.gipsghana.com",
  heroImage: "/images/conference-hero.png",
  capacity: 1200,
  registeredCount: 684,
  registrationFee: 1500,
  registrationCurrency: "GHS",
  about:
    "The National Procurement and Supply Conference (NPSC), convened by the Ghana Institute of Procurement and Supply (GIPS) in collaboration with the Public Procurement Authority, is Ghana's flagship gathering for public and private sector procurement and supply chain excellence. After a successful hiatus, NPSC RETURNS in 2026 with plenaries, workshops, and exhibitions designed to improve efficiency and transparency in procurement.",
  organizers: [
    {
      name: "Ghana Institute of Procurement and Supply",
      logo: "/images/conveners/gips.png",
    },
    {
      name: "Republic of Ghana",
      logo: "/images/conveners/ghana.png",
    },
    {
      name: "Public Procurement Authority",
      logo: "/images/conveners/ppa.png",
    },
    {
      name: "National Procurement and Supply Conference",
      logo: "/images/conveners/npsc.png",
    },
  ],
  agenda: [
    { time: "Day 1 · 8:30 AM", title: "Opening ceremony & keynote", speaker: "Dignitaries & GIPS leadership" },
    { time: "Day 1 · 10:30 AM", title: "Plenary: Public procurement reform", speaker: "PPA & sector experts" },
    { time: "Day 1 · 1:00 PM", title: "Networking lunch & exhibition" },
    { time: "Day 1 · 2:30 PM", title: "Parallel sessions: Supply chain digitalisation" },
    { time: "Day 2 · 9:00 AM", title: "Workshops & capacity building" },
    { time: "Day 2 · 3:00 PM", title: "Closing plenary & awards" },
  ],
  tiers: [
    {
      id: "early",
      name: "Early bird delegate",
      description: "Best rate for individual professionals. Limited availability.",
      price: 350,
      currency: "GHS",
      perks: ["Full 2-day access", "Conference materials", "Certificate of attendance", "Networking sessions"],
    },
    {
      id: "standard",
      name: "Standard delegate",
      description: "Full conference access for procurement and supply professionals.",
      price: 1500,
      currency: "GHS",
      perks: ["Full 2-day access", "Lunch on both days", "Exhibition hall access", "Certificate of attendance"],
    },
    {
      id: "corporate",
      name: "Corporate / table",
      description: "For teams and organisations sending multiple attendees.",
      price: 2200,
      currency: "GHS",
      perks: ["Table for 5 delegates", "Priority seating", "Brand visibility in programme", "Dedicated registration support"],
    },
  ],
  features: [
    {
      icon: "users",
      title: "Ghana's flagship procurement forum",
      description: "Connect with peers from government, academia, and industry under one roof.",
    },
    {
      icon: "zap",
      title: "Fast digital registration",
      description: "Register in minutes online and track your status with a reference code.",
    },
    {
      icon: "credit-card",
      title: "Flexible payment",
      description: "Pay via Mobile Money or bank transfer to GIPS after registering online.",
    },
    {
      icon: "award",
      title: "Certificate of attendance",
      description: "Receive your NPSC certificate digitally once issued by the organisers.",
    },
    {
      icon: "shield",
      title: "Trusted conveners",
      description: "Organised by GIPS and partners committed to procurement excellence in Ghana.",
    },
  ],
  audiences: [
    {
      id: "public-sector",
      title: "Public sector procurement officers",
      description: "Strengthen compliance, transparency, and value for money in government procurement.",
    },
    {
      id: "supply-chain",
      title: "Supply chain & logistics professionals",
      description: "Explore digital tools, supplier management, and end-to-end supply chain best practices.",
    },
    {
      id: "private-sector",
      title: "Private sector vendors & suppliers",
      description: "Understand public procurement processes and build stronger client relationships.",
    },
    {
      id: "academia",
      title: "Students & emerging professionals",
      description: "Learn from leaders and kick-start your career in procurement and supply.",
    },
  ],
  steps: [
    {
      step: 1,
      title: "Register your details",
      description: "Fill in your name, email, and phone to reserve your seat.",
    },
    {
      step: 2,
      title: "Complete your payment",
      description: "Send the pass fee to GIPS via Mobile Money or bank transfer using the details on the registration page.",
    },
    {
      step: 3,
      title: "Save your reference code",
      description: "Use your registration reference to check status and complete payment if needed.",
    },
    {
      step: 4,
      title: "Receive your certificate",
      description: "After the conference, GIPS issues certificates of attendance through official channels.",
    },
  ],
  faqs: [
    {
      question: "Who should attend NPSC 2026?",
      answer:
        "Procurement and supply chain professionals in the public and private sectors, vendors, academics, students, and anyone interested in improving procurement outcomes in Ghana.",
    },
    {
      question: "Where is the conference held?",
      answer:
        "UPSA Auditorium, University of Professional Studies, Accra, Ghana — 2–3 September 2026.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "Mobile Money (MTN, Telecel, AirtelTigo) to 020 168 9882, or bank transfer to ADB account 1161000112225801 — Ghana Institute of Procurement and Supply, ADB House. Include your registration reference in the payment memo.",
    },
    {
      question: "Will I receive a certificate?",
      answer:
        "Confirmed delegates receive a certificate of attendance after the conference, issued and distributed by GIPS through official channels.",
    },
    {
      question: "Can I register on behalf of my organisation?",
      answer:
        "Yes. Use the corporate package for teams, or register multiple standard passes with individual attendee details.",
    },
  ],
  partners: [
    {
      id: "upsa",
      name: "University of Professional Studies, Accra",
      logo: "/images/partners/upsa.png",
    },
    {
      id: "knust",
      name: "Kwame Nkrumah University of Science and Technology",
      logo: "/images/partners/knust.png",
    },
    {
      id: "civil-service",
      name: "Office of the Head of the Civil Service",
      logo: "/images/partners/civil-service.png",
    },
    {
      id: "gimpa",
      name: "GIMPA Training and Consulting",
      logo: "/images/partners/gimpa.png",
    },
    {
      id: "kpmg",
      name: "KPMG",
      logo: "/images/partners/kpmg.png",
    },
  ],
};

export function getEventBySlug(slug: string): MockEvent | null {
  if (slug === mockEvent.slug) return mockEvent;
  return null;
}

export function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}
