"use client";

import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  getParticipantsColumns,
  type ParticipantRow,
} from "@/components/admin/participants-columns";
import { ParticipantsTableSkeleton } from "@/components/admin/participants-skeleton";
import { DataTable } from "@/components/data-table/data-table";
import { useStaffSession } from "@/components/auth/session-provider";

type Props = {
  eventId: Id<"events"> | null;
  statusFilter: string;
  ticketFilter: string;
};

export function ParticipantsTable({
  eventId,
  statusFilter,
  ticketFilter,
}: Props) {
  const { sessionToken, user } = useStaffSession();
  const promote = useMutation(api.registrations.promoteWaitlistedRegistration);
  const [promotingId, setPromotingId] = useState<Id<"registrations"> | null>(
    null
  );

  const ticketTypeId =
    ticketFilter !== "all" && !ticketFilter.startsWith("kind:")
      ? (ticketFilter as Id<"ticketTypes">)
      : undefined;
  const ticketKind: Doc<"registrations">["ticketKind"] | undefined =
    ticketFilter.startsWith("kind:")
      ? (ticketFilter.replace("kind:", "") as Doc<"registrations">["ticketKind"])
      : undefined;

  const participants = useQuery(
    api.registrations.listForAdmin,
    sessionToken && eventId
      ? {
          sessionToken,
          eventId,
          ...(statusFilter !== "all"
            ? {
                status: statusFilter as ParticipantRow["status"],
              }
            : {}),
          ...(ticketTypeId ? { ticketTypeId } : {}),
          ...(ticketKind && !ticketTypeId ? { ticketKind } : {}),
        }
      : "skip"
  );

  const canPromote = user?.role === "admin";

  const handlePromote = useCallback(
    async (registrationId: Id<"registrations">) => {
      if (!sessionToken || !canPromote) return;
      setPromotingId(registrationId);
      try {
        await promote({ sessionToken, registrationId });
        toast.success("Promoted from waitlist");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Promote failed");
      } finally {
        setPromotingId(null);
      }
    },
    [sessionToken, canPromote, promote]
  );

  const columns = useMemo(
    () =>
      getParticipantsColumns({
        canPromote,
        onPromote: (id) => void handlePromote(id),
        promotingId,
      }),
    [canPromote, handlePromote, promotingId]
  );

  const data = useMemo((): ParticipantRow[] => {
    if (!participants) return [];
    return participants as ParticipantRow[];
  }, [participants]);

  if (!eventId) {
    return (
      <p className="text-sm text-muted-foreground">
        Select an edition to view participants.
      </p>
    );
  }

  if (participants === undefined) {
    return <ParticipantsTableSkeleton />;
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(row) => row._id}
      filterColumnId="fullName"
      filterPlaceholder="Search name, email, company, position, confirmation…"
      emptyMessage="No participants match these filters."
    />
  );
}
