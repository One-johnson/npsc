import Link from "next/link";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { EventsTable } from "@/components/admin/events-table";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Overview of events, tickets, and staff for the platform.
          </p>
        </div>
        <Link
          href="/admin/events"
          className={buttonVariants({ variant: "outline" })}
        >
          All events
        </Link>
      </div>
      <DashboardStats />
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Events</h2>
          <p className="text-sm text-muted-foreground">
            Search, sort, and manage conference editions. Select rows to delete
            in bulk (admins only).
          </p>
        </div>
        <EventsTable enableBulkDelete={false} />
      </section>
    </div>
  );
}
