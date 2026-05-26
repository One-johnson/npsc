"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStaffSession } from "@/components/auth/session-provider";
import { ParticipantTicketStatsSkeleton } from "@/components/admin/participants-skeleton";
import { cn } from "@/lib/utils";

const KIND_LABELS: Record<string, string> = {
  participant: "Participant",
  vip: "International",
  speaker: "Speaker",
  sponsor: "Sponsor",
  exhibitor: "Exhibitor",
  media: "Media",
};

type Props = {
  eventId: Id<"events"> | null;
  highlightTicketTypeId?: Id<"ticketTypes"> | null;
};

export function ParticipantTicketStats({ eventId, highlightTicketTypeId }: Props) {
  const { sessionToken } = useStaffSession();
  const stats = useQuery(
    api.registrations.participantStatsForAdmin,
    sessionToken && eventId ? { sessionToken, eventId } : "skip"
  );

  if (!eventId) {
    return null;
  }

  if (stats === undefined) {
    return <ParticipantTicketStatsSkeleton />;
  }

  if (stats === null) {
    return (
      <p className="text-sm text-destructive">Event not found.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <SummaryCard label="Event capacity" value={stats.event.capacity} />
        <SummaryCard
          label="Registered (event)"
          value={stats.event.registeredCount}
        />
        <SummaryCard label="Active registrations" value={stats.totals.active} />
        <SummaryCard label="Confirmed" value={stats.totals.confirmed} />
        <SummaryCard label="On waitlist" value={stats.totals.waitlisted} />
        <SummaryCard
          label="Certificates issued"
          value={stats.totals.certificatesIssued}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stats.byTicket.map((ticket) => (
          <Card
            key={ticket.ticketTypeId}
            className={cn(
              highlightTicketTypeId === ticket.ticketTypeId &&
                "ring-2 ring-primary"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm font-semibold">
                  {ticket.name}
                </CardTitle>
                <Badge variant={ticket.isActive ? "secondary" : "outline"}>
                  {KIND_LABELS[ticket.kind] ?? ticket.kind}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sold / capacity</span>
                <span className="font-medium tabular-nums">
                  {ticket.soldCount} / {ticket.capacity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spots left</span>
                <span className="font-medium tabular-nums">
                  {ticket.spotsLeft}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-border pt-2">
                <StatPill label="Active" value={ticket.counts.active} />
                <StatPill label="Waitlist" value={ticket.counts.waitlisted} />
                <StatPill label="Pending" value={ticket.counts.pending} />
                <StatPill label="Confirmed" value={ticket.counts.confirmed} />
              </div>
              <p className="text-xs text-muted-foreground">
                {ticket.counts.total} registration
                {ticket.counts.total === 1 ? "" : "s"} for this pass
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-muted/50 px-2 py-1.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold tabular-nums">{value}</p>
    </div>
  );
}
