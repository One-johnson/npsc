import { ParticipantsPanel } from "@/components/admin/participants-panel";

export const metadata = {
  title: "Participants",
};

export default function AdminParticipantsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Participants</h1>
        <p className="mt-1 text-muted-foreground">
          View and manage registrations by conference edition and pass type.
          Promote waitlisted attendees when capacity opens. Issue certificates
          for confirmed participants.
        </p>
      </div>
      <ParticipantsPanel />
    </div>
  );
}
