import { EventsPanel } from "@/components/admin/events-panel";

export const metadata = {
  title: "Events",
};

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Events</h1>
        <p className="mt-1 text-muted-foreground">
          Manage conference editions by year. Use <strong>Duplicate for next year</strong> to
          copy ticket types into a new event while keeping the previous edition&apos;s
          registrations. Click a row for details or use the menu for actions.
        </p>
      </div>
      <EventsPanel />
    </div>
  );
}
