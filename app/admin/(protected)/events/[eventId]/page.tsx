import { EventDetailPanel } from "@/components/admin/event-detail-panel";
import type { Id } from "@/convex/_generated/dataModel";

type Props = {
  params: Promise<{ eventId: string }>;
};

export const metadata = {
  title: "Event details",
};

export default async function AdminEventDetailPage({ params }: Props) {
  const { eventId } = await params;
  return (
    <EventDetailPanel eventId={eventId as Id<"events">} />
  );
}
