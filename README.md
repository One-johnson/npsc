# NPSC Event Platform

Next.js (App Router) + Convex + Tailwind + ShadCN for conference registration, payments, live reporting, and certificate issuance.

## Phase 1 (complete)

- **Custom session auth** — PBKDF2 passwords, `sessions` table, HTTP-only cookie, staff roles (`admin`, `finance`)
- **Convex data model** — organizations, events, ticket types (participant, VIP, speaker, sponsor, exhibitor, media)
- **Admin dashboard** — `/admin/dashboard`, events, staff management
- **Public API** — `events.getBySlug` (marketing can use `usePublicEvent` hook; falls back to `mock-event.ts`)

## Phase 2 (complete)

- **Attendee registration in Convex** — `registrations.registerAttendee` with per-ticket and overall event capacity
- **Waitlist** — when the event or selected pass is full, registrations are stored as `waitlisted` without consuming capacity; queue position is shown on the status page
- **Admin** — event detail shows registrations; admins can **Promote** a waitlisted attendee when capacity allows (`promoteWaitlistedRegistration`)
- **Public UX** — `/register/[slug]` loads the correct event from the URL; pass types and dialogs support joining the waitlist; `/registration/[code]` shows registration status
- **Yearly editions** — keep `npsc-2026` as archive; use **Duplicate for next year** on Admin → Events to create `npsc-2027` with copied ticket types (zero sales). Unpublish the old edition so the public site uses the latest published slug.
- **Registration status** — `pending` until payment; `confirmed` after payment (`confirmRegistrationPayment`)
- **Participants admin** — `/admin/participants` with company, position, and registered date/time

## Phase 3 (complete)

- **Payments ledger** — `payments` table linked to registrations (amount, method, provider: `mock` | `manual` | `hubtel`)
- **Mock checkout** — public “Pay now” in the registration flow records a payment and confirms registration (use until Hubtel is configured)
- **Manual payments** — Admin/Finance → **Payments** to record bank/MoMo and confirm pending registrations
- **Hubtel** (optional later) — set `PAYMENT_PROVIDER=hubtel` and webhook env vars when merchant account is ready

## Phase 4 (current)

- **Registration status page** — `/registration/[code]` for payment, waitlist position, and certificate download (no digital tickets or QR)
- **Live admin reporting** — dashboard stats and per-event participant breakdown via Convex subscriptions
- **Certificates** — admins issue NPSC certificates anytime; staff download PDFs from Admin → Participants (no public download)
- **Marketing site** — landing page with event info, registration CTA, certificate-focused messaging

## Getting started

### 1. Install and run Convex

```bash
npm install
npx convex dev
```

Convex writes `NEXT_PUBLIC_CONVEX_URL` to `.env.local`. Keep `npx convex dev` running (or use `npm run dev:full`).

In the **Convex dashboard → Settings → Environment variables**, set:

- `SEED_SECRET` — long random string used once for bootstrap

### 2. Bootstrap data

Open [http://localhost:3000/admin/setup](http://localhost:3000/admin/setup), enter your name, email, and password. You will be redirected to sign in and open the admin dashboard.

Or from the shell (after Convex is configured):

```bash
SEED_SECRET=your-secret SEED_ADMIN_EMAIL=you@org.com SEED_ADMIN_PASSWORD=your-password SEED_ADMIN_NAME="Your Name" npm run seed
```

### 3. Run Next.js

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Staff login: [http://localhost:3000/login](http://localhost:3000/login)
- Admin: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run dev:full` | Convex + Next.js together |
| `npm run convex` | Convex dev watcher |
| `npm run seed` | CLI bootstrap (needs env vars) |

## Regenerating Convex types

After changing `convex/schema.ts` or functions, run:

```bash
npx convex dev
```

This replaces `convex/_generated/` with fully typed bindings (committed stubs work until then).

## Optional later

- **Hubtel** — redirect checkout + webhook when merchant account is ready
- **Exports** — CSV export for participants and payments
