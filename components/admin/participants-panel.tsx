"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { ParticipantTicketStats } from "@/components/admin/participant-ticket-stats";
import { ParticipantsTable } from "@/components/admin/participants-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaffSession } from "@/components/auth/session-provider";
import {
  ParticipantsMetaSkeleton,
  ParticipantsPanelSkeleton,
} from "@/components/admin/participants-skeleton";
import { formatEditionSelectLabel } from "@/lib/event/slug-year";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export function ParticipantsPanel() {
  const { sessionToken } = useStaffSession();
  const events = useQuery(
    api.events.list,
    sessionToken ? { sessionToken } : "skip"
  );

  const [eventId, setEventId] = useState<Id<"events"> | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [ticketFilter, setTicketFilter] = useState("all");

  useEffect(() => {
    if (!events?.length || eventId) return;
    setEventId(events[0]._id);
  }, [events, eventId]);

  const stats = useQuery(
    api.registrations.participantStatsForAdmin,
    sessionToken && eventId ? { sessionToken, eventId } : "skip"
  );

  const ticketFilterOptions = useMemo(() => {
    if (!stats?.byTicket) {
      return [{ value: "all", label: "All pass types" }];
    }
    return [
      { value: "all", label: "All pass types" },
      ...stats.byTicket.map((t) => ({
        value: t.ticketTypeId,
        label: t.name,
      })),
    ];
  }, [stats]);

  const highlightTicketId =
    ticketFilter !== "all" ? (ticketFilter as Id<"ticketTypes">) : null;

  const editionSelectItems = useMemo(
    () =>
      (events ?? []).map((event) => ({
        value: event._id,
        label: formatEditionSelectLabel(event),
      })),
    [events]
  );

  const selectedEvent = events?.find((e) => e._id === eventId);
  const isStatsLoading = Boolean(eventId) && stats === undefined;

  if (events === undefined) {
    return <ParticipantsPanelSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end gap-3">
        <div className="grid gap-2">
          <span className="text-sm font-medium">Edition</span>
          <Select
            value={eventId ?? ""}
            items={editionSelectItems}
            onValueChange={(v) => {
              if (!v) return;
              setEventId(v as Id<"events">);
              setTicketFilter("all");
            }}
          >
            <SelectTrigger className="h-9 w-[min(100%,280px)]">
              <SelectValue placeholder="Select edition" />
            </SelectTrigger>
            <SelectContent>
              {events?.map((event) => (
                <SelectItem key={event._id} value={event._id}>
                  {formatEditionSelectLabel(event)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-medium">Pass type</span>
          <Select
            value={ticketFilter}
            onValueChange={(v) => setTicketFilter(v ?? "all")}
            disabled={!eventId}
          >
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Pass type" />
            </SelectTrigger>
            <SelectContent>
              {ticketFilterOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-medium">Status</span>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v ?? "all")}
            disabled={!eventId}
          >
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isStatsLoading ? (
        <ParticipantsMetaSkeleton />
      ) : selectedEvent ? (
        <p className="text-sm text-muted-foreground">
          {selectedEvent.edition} · {selectedEvent.date} ·{" "}
          {selectedEvent.registeredCount} / {selectedEvent.capacity} event capacity
        </p>
      ) : null}

      <ParticipantTicketStats
        eventId={eventId}
        highlightTicketTypeId={highlightTicketId}
      />

      <ParticipantsTable
        eventId={eventId}
        statusFilter={statusFilter}
        ticketFilter={ticketFilter}
        certificateEvent={
          selectedEvent
            ? {
                titleLine2: selectedEvent.titleLine2,
                edition: selectedEvent.edition,
                date: selectedEvent.date,
                venue: selectedEvent.venue,
                city: selectedEvent.city,
              }
            : null
        }
      />
    </div>
  );
}
