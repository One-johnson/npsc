"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  getParticipantsColumns,
  type ParticipantRow,
} from "@/components/admin/participants-columns";
import { RegistrationDetailSheet } from "@/components/admin/registration-detail-sheet";
import { ParticipantsTableSkeleton } from "@/components/admin/participants-skeleton";
import { DataTable } from "@/components/data-table/data-table";
import { useStaffSession } from "@/components/auth/session-provider";
import type { CertificateEventContext } from "@/lib/certificate/build-pdf-data";

type Props = {
  eventId: Id<"events"> | null;
  statusFilter: string;
  ticketFilter: string;
  certificateEvent: CertificateEventContext | null;
};

export function ParticipantsTable({
  eventId,
  statusFilter,
  ticketFilter,
  certificateEvent,
}: Props) {
  const { sessionToken, user } = useStaffSession();
  const promote = useMutation(api.registrations.promoteWaitlistedRegistration);
  const issueCertificate = useMutation(api.certificates.issue);
  const revokeCertificate = useMutation(api.certificates.revoke);
  const [promotingId, setPromotingId] = useState<Id<"registrations"> | null>(
    null
  );
  const [certActionId, setCertActionId] = useState<Id<"registrations"> | null>(
    null
  );
  const [viewParticipant, setViewParticipant] = useState<ParticipantRow | null>(
    null
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleViewRegistration = useCallback((row: ParticipantRow) => {
    setViewParticipant(row);
    setSheetOpen(true);
  }, []);

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
  const canManageCertificates = user?.role === "admin";
  const canDownloadCertificate =
    user?.role === "admin" || user?.role === "finance";

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

  const handleIssueCertificate = useCallback(
    async (registrationId: Id<"registrations">) => {
      if (!sessionToken || !canManageCertificates) return;
      setCertActionId(registrationId);
      try {
        const result = await issueCertificate({
          sessionToken,
          registrationId,
        });
        toast.success(
          result.alreadyIssued
            ? "Certificate already issued"
            : `Certificate issued: ${result.certificateNumber}`
        );
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Issue failed");
      } finally {
        setCertActionId(null);
      }
    },
    [sessionToken, canManageCertificates, issueCertificate]
  );

  const handleRevokeCertificate = useCallback(
    async (registrationId: Id<"registrations">) => {
      if (!sessionToken || !canManageCertificates) return;
      setCertActionId(registrationId);
      try {
        await revokeCertificate({ sessionToken, registrationId });
        toast.success("Certificate revoked");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Revoke failed");
      } finally {
        setCertActionId(null);
      }
    },
    [sessionToken, canManageCertificates, revokeCertificate]
  );

  const columns = useMemo(
    () =>
      getParticipantsColumns({
        canPromote,
        canManageCertificates,
        canDownloadCertificate,
        certificateEvent,
        onPromote: (id) => void handlePromote(id),
        onIssueCertificate: (id) => void handleIssueCertificate(id),
        onRevokeCertificate: (id) => void handleRevokeCertificate(id),
        onViewRegistration: handleViewRegistration,
        promotingId,
        certActionId,
      }),
    [
      canPromote,
      canManageCertificates,
      canDownloadCertificate,
      certificateEvent,
      handlePromote,
      handleIssueCertificate,
      handleRevokeCertificate,
      handleViewRegistration,
      promotingId,
      certActionId,
    ]
  );

  const data = useMemo((): ParticipantRow[] => {
    if (!participants) return [];
    return participants as ParticipantRow[];
  }, [participants]);

  useEffect(() => {
    if (!sheetOpen || !viewParticipant) return;
    const updated = data.find((p) => p._id === viewParticipant._id);
    if (updated) setViewParticipant(updated);
  }, [data, sheetOpen, viewParticipant?._id]);

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
    <>
      <DataTable
        columns={columns}
        data={data}
        getRowId={(row) => row._id}
        filterColumnId="fullName"
        filterPlaceholder="Search name, email, company, position, confirmation…"
        emptyMessage="No participants match these filters."
      />
      <RegistrationDetailSheet
        participant={viewParticipant}
        certificateEvent={certificateEvent}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) setViewParticipant(null);
        }}
        canDownloadCertificate={canDownloadCertificate}
      />
    </>
  );
}
