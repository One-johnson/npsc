import { v } from "convex/values";
import { query } from "./_generated/server";
import {
  canViewFinance,
  canViewRegistrations,
  requireAuth,
} from "./lib/rbac";

const REPORT_DAYS = 30;

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function lastNDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    d.setUTCDate(d.getUTCDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function formatDayLabel(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00.000Z`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Live dashboard metrics and chart series (Convex subscription). */
export const reporting = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    const showRegistrations = canViewRegistrations(user.role);
    const showFinance = canViewFinance(user.role);

    const events = await ctx.db.query("events").collect();
    const ticketTypes = await ctx.db.query("ticketTypes").collect();
    const users = await ctx.db.query("users").collect();

    const registrations = showRegistrations
      ? await ctx.db.query("registrations").collect()
      : [];
    const payments = showFinance
      ? await ctx.db
          .query("payments")
          .filter((q) => q.eq(q.field("status"), "completed"))
          .collect()
      : [];
    const certificates = showRegistrations
      ? await ctx.db.query("certificates").collect()
      : [];

    const days = lastNDays(REPORT_DAYS);
    const regByDay = new Map(
      days.map((d) => [
        d,
        { date: d, label: formatDayLabel(d), total: 0, confirmed: 0, pending: 0 },
      ])
    );
    const revenueByDay = new Map(
      days.map((d) => [d, { date: d, label: formatDayLabel(d), amount: 0 }])
    );

    let pending = 0;
    let confirmed = 0;
    let waitlisted = 0;
    let cancelled = 0;

    for (const r of registrations) {
      if (r.status === "pending") pending += 1;
      else if (r.status === "confirmed") confirmed += 1;
      else if (r.status === "waitlisted") waitlisted += 1;
      else if (r.status === "cancelled") cancelled += 1;

      const key = dayKey(r.createdAt);
      const bucket = regByDay.get(key);
      if (bucket) {
        bucket.total += 1;
        if (r.status === "confirmed") bucket.confirmed += 1;
        if (r.status === "pending") bucket.pending += 1;
      }
    }

    let totalRevenue = 0;
    const revenueByCurrency = new Map<string, number>();
    const paymentsByMethod = new Map<string, { count: number; amount: number }>();

    for (const p of payments) {
      totalRevenue += p.amount;
      revenueByCurrency.set(
        p.currency,
        (revenueByCurrency.get(p.currency) ?? 0) + p.amount
      );
      const methodKey = p.method;
      const methodRow = paymentsByMethod.get(methodKey) ?? {
        count: 0,
        amount: 0,
      };
      methodRow.count += 1;
      methodRow.amount += p.amount;
      paymentsByMethod.set(methodKey, methodRow);

      const key = dayKey(p.paidAt);
      const bucket = revenueByDay.get(key);
      if (bucket) bucket.amount += p.amount;
    }

    const certificatesIssued = certificates.filter((c) => !c.revokedAt).length;

    const eventById = new Map(events.map((e) => [e._id, e]));
    const eventCapacity = events
      .map((e) => ({
        eventId: e._id,
        slug: e.slug,
        title: e.titleLine2,
        edition: e.edition,
        registeredCount: e.registeredCount,
        capacity: e.capacity,
        fillPercent:
          e.capacity > 0
            ? Math.round((e.registeredCount / e.capacity) * 100)
            : 0,
      }))
      .sort((a, b) => b.registeredCount - a.registeredCount);

    const passTypeSales = ticketTypes
      .map((t) => {
        const event = eventById.get(t.eventId);
        return {
          name: event ? `${t.name} (${event.edition})` : t.name,
          soldCount: t.soldCount,
          capacity: t.capacity,
          kind: t.kind,
        };
      })
      .filter((t) => t.capacity > 0 || t.soldCount > 0)
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 12);

    const primaryCurrency =
      revenueByCurrency.size > 0
        ? [...revenueByCurrency.entries()].sort((a, b) => b[1] - a[1])[0][0]
        : "GHS";

    return {
      updatedAt: Date.now(),
      summary: {
        eventCount: events.length,
        publishedEventCount: events.filter((e) => e.isPublished).length,
        ticketTypeCount: ticketTypes.length,
        totalCapacity: ticketTypes.reduce((s, t) => s + t.capacity, 0),
        totalSold: ticketTypes.reduce((s, t) => s + t.soldCount, 0),
        staffCount: users.length,
        totalRegistrations: registrations.length,
        pending,
        confirmed,
        waitlisted,
        cancelled,
        certificatesIssued,
        paymentCount: payments.length,
        totalRevenue,
        primaryCurrency,
      },
      registrationsByStatus: showRegistrations
        ? [
            { status: "confirmed", label: "Confirmed", count: confirmed },
            { status: "pending", label: "Pending payment", count: pending },
            { status: "waitlisted", label: "Waitlisted", count: waitlisted },
            { status: "cancelled", label: "Cancelled", count: cancelled },
          ].filter((row) => row.count > 0)
        : [],
      registrationsOverTime: showRegistrations
        ? days.map((d) => regByDay.get(d)!)
        : [],
      revenueOverTime: showFinance ? days.map((d) => revenueByDay.get(d)!) : [],
      paymentsByMethod: showFinance
        ? [...paymentsByMethod.entries()].map(([method, row]) => ({
            method,
            label:
              method === "momo"
                ? "Mobile Money"
                : method === "card"
                  ? "Card"
                  : method === "bank"
                    ? "Bank"
                    : "Other",
            count: row.count,
            amount: row.amount,
          }))
        : [],
      passTypeSales: showRegistrations ? passTypeSales : [],
      eventCapacity: showRegistrations ? eventCapacity : [],
    };
  },
});
