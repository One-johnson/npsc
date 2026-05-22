import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hashPassword } from "./lib/password";
import { ensureUserStaffId, generateUniqueStaffId } from "./lib/staffId";

const NPSC_SEED = {
  organization: {
    name: "Ghana Institute of Procurement and Supply",
    slug: "gips-ghana",
  },
  event: {
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
    registeredCount: 0,
    about:
      "The National Procurement and Supply Conference (NPSC), convened by the Ghana Institute of Procurement and Supply (GIPS) in collaboration with the Public Procurement Authority, is Ghana's flagship gathering for public and private sector procurement and supply chain excellence.",
    organizers: [
      { name: "Ghana Institute of Procurement and Supply", logo: "/images/conveners/gips.png" },
      { name: "Republic of Ghana", logo: "/images/conveners/ghana.png" },
      { name: "Public Procurement Authority", logo: "/images/conveners/ppa.png" },
      { name: "National Procurement and Supply Conference", logo: "/images/conveners/npsc.png" },
    ],
    agenda: [
      { time: "Day 1 · 8:30 AM", title: "Opening ceremony & keynote", speaker: "Dignitaries & GIPS leadership" },
      { time: "Day 1 · 10:30 AM", title: "Plenary: Public procurement reform", speaker: "PPA & sector experts" },
      { time: "Day 1 · 1:00 PM", title: "Networking lunch & exhibition" },
      { time: "Day 1 · 2:30 PM", title: "Parallel sessions: Supply chain digitalisation" },
      { time: "Day 2 · 9:00 AM", title: "Workshops & capacity building" },
      { time: "Day 2 · 3:00 PM", title: "Closing plenary & awards" },
    ],
    features: [
      { icon: "users", title: "Ghana's flagship procurement forum", description: "Connect with peers from government, academia, and industry under one roof." },
      { icon: "zap", title: "Fast digital registration", description: "Register in minutes online and track your status with a reference code." },
      { icon: "credit-card", title: "Secure Hubtel payments", description: "Pay with Mobile Money, card, or bank transfer — safe and convenient." },
      { icon: "award", title: "Certificate of attendance", description: "Receive your NPSC certificate digitally once issued by the organisers." },
      { icon: "shield", title: "Trusted conveners", description: "Organised by GIPS and partners committed to procurement excellence in Ghana." },
    ],
    audiences: [
      { id: "public-sector", title: "Public sector procurement officers", description: "Strengthen compliance, transparency, and value for money in government procurement." },
      { id: "supply-chain", title: "Supply chain & logistics professionals", description: "Explore digital tools, supplier management, and end-to-end supply chain best practices." },
      { id: "private-sector", title: "Private sector vendors & suppliers", description: "Understand public procurement processes and build stronger client relationships." },
      { id: "academia", title: "Students & emerging professionals", description: "Learn from leaders and kick-start your career in procurement and supply." },
    ],
    steps: [
      { step: 1, title: "Register your details", description: "Fill in your name, email, and phone to reserve your seat." },
      { step: 2, title: "Pay securely via Hubtel", description: "Complete payment with MoMo, card, or bank transfer." },
      { step: 3, title: "Save your reference code", description: "Use your registration reference to check status and complete payment if needed." },
      { step: 4, title: "Receive your certificate", description: "After the conference, GIPS issues certificates through official channels." },
    ],
    faqs: [
      { question: "Who should attend NPSC 2026?", answer: "Procurement and supply chain professionals in the public and private sectors, vendors, academics, students, and anyone interested in improving procurement outcomes in Ghana." },
      { question: "Where is the conference held?", answer: "UPSA Auditorium, University of Professional Studies, Accra, Ghana — 2–3 September 2026." },
      { question: "What payment methods are accepted?", answer: "Mobile Money (MTN, Telecel, AirtelTigo), debit/credit cards, and bank transfer through Hubtel." },
      { question: "Will I receive a certificate?", answer: "Confirmed delegates receive a certificate of attendance after the conference, issued and distributed by GIPS — not via self-service download." },
      { question: "Can I register on behalf of my organisation?", answer: "Yes. Use the corporate package for teams, or register multiple standard passes with individual attendee details." },
    ],
    partners: [
      { id: "upsa", name: "University of Professional Studies, Accra", logo: "/images/partners/upsa.png" },
      { id: "knust", name: "Kwame Nkrumah University of Science and Technology", logo: "/images/partners/knust.png" },
      { id: "civil-service", name: "Office of the Head of the Civil Service", logo: "/images/partners/civil-service.png" },
      { id: "gimpa", name: "GIMPA Training and Consulting", logo: "/images/partners/gimpa.png" },
      { id: "kpmg", name: "KPMG", logo: "/images/partners/kpmg.png" },
    ],
  },
  ticketTypes: [
    {
      slug: "participant",
      kind: "participant" as const,
      name: "Participant / Delegate",
      description: "Full conference access for procurement and supply professionals.",
      price: 500,
      currency: "GHS",
      capacity: 800,
      perks: ["Full 2-day access", "Lunch on both days", "Exhibition hall access", "Certificate of attendance"],
      sortOrder: 0,
    },
    {
      slug: "vip",
      kind: "vip" as const,
      name: "VIP Delegate",
      description: "Premium access with priority seating and networking.",
      price: 1200,
      currency: "GHS",
      capacity: 100,
      perks: ["VIP lounge access", "Priority seating", "Exclusive networking session"],
      sortOrder: 1,
    },
    {
      slug: "speaker",
      kind: "speaker" as const,
      name: "Speaker",
      description: "Complimentary pass for confirmed session speakers.",
      price: 0,
      currency: "GHS",
      capacity: 80,
      perks: ["Speaker green room", "Full conference access"],
      sortOrder: 2,
    },
    {
      slug: "sponsor",
      kind: "sponsor" as const,
      name: "Sponsor",
      description: "Sponsor representative passes.",
      price: 0,
      currency: "GHS",
      capacity: 50,
      perks: ["Brand visibility", "Exhibition priority"],
      sortOrder: 3,
    },
    {
      slug: "exhibitor",
      kind: "exhibitor" as const,
      name: "Exhibitor",
      description: "Exhibition booth staff passes.",
      price: 1500,
      currency: "GHS",
      capacity: 120,
      perks: ["Exhibition booth space", "2 staff passes"],
      sortOrder: 4,
    },
    {
      slug: "media",
      kind: "media" as const,
      name: "Media",
      description: "Accredited press and media representatives.",
      price: 0,
      currency: "GHS",
      capacity: 30,
      perks: ["Press gallery access", "Media kit"],
      sortOrder: 5,
    },
  ],
};

export const bootstrap = mutation({
  args: {
    /** Required for CLI bootstrap when SEED_SECRET is set. Omitted for one-time web setup. */
    secret: v.optional(v.string()),
    adminEmail: v.string(),
    adminPassword: v.string(),
    adminName: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUsers = await ctx.db.query("users").first();
    if (existingUsers) {
      throw new Error("Database already seeded. Sign in at /login.");
    }

    const expectedSecret = process.env.SEED_SECRET;
    if (args.secret !== undefined) {
      if (!expectedSecret || args.secret !== expectedSecret) {
        throw new Error("Invalid seed secret");
      }
    }

    const adminEmail = args.adminEmail.trim().toLowerCase();
    if (!adminEmail.includes("@")) {
      throw new Error("Enter a valid admin email");
    }
    const adminName = args.adminName.trim();
    if (adminName.length < 2) {
      throw new Error("Enter your full name");
    }
    if (args.adminPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    const now = Date.now();
    const passwordHash = hashPassword(args.adminPassword);
    const adminStaffId = await generateUniqueStaffId(ctx);

    const adminId = await ctx.db.insert("users", {
      email: adminEmail,
      name: adminName,
      staffId: adminStaffId,
      passwordHash,
      role: "admin",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    let org = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", NPSC_SEED.organization.slug))
      .unique();

    if (!org) {
      const orgId = await ctx.db.insert("organizations", {
        ...NPSC_SEED.organization,
        createdAt: now,
      });
      org = (await ctx.db.get(orgId))!;
    }

    let event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", NPSC_SEED.event.slug))
      .unique();

    if (!event) {
      const eventId = await ctx.db.insert("events", {
        organizationId: org._id,
        ...NPSC_SEED.event,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      });
      event = (await ctx.db.get(eventId))!;

      for (const ticket of NPSC_SEED.ticketTypes) {
        await ctx.db.insert("ticketTypes", {
          eventId: event._id,
          ...ticket,
          soldCount: 0,
          isActive: true,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    return {
      adminId,
      adminEmail,
      adminStaffId,
      organizationId: org._id,
      eventId: event._id,
      eventSlug: event.slug,
    };
  },
});

export const backfillStaffIds = mutation({
  args: { secret: v.string() },
  handler: async (ctx, args) => {
    const expectedSecret = process.env.SEED_SECRET;
    if (!expectedSecret || args.secret !== expectedSecret) {
      throw new Error("Invalid seed secret");
    }
    const users = await ctx.db.query("users").collect();
    const assigned: { email: string; staffId: string }[] = [];
    for (const user of users) {
      if (!user.staffId) {
        const staffId = await ensureUserStaffId(ctx, user);
        assigned.push({ email: user.email, staffId });
      }
    }
    return { assigned };
  },
});

export const isSeeded = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.db.query("users").first();
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", NPSC_SEED.event.slug))
      .unique();
    return { seeded: Boolean(user && event) };
  },
});
