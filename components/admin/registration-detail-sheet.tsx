"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CertificatePdfDownload } from "@/components/certificate/certificate-pdf-download";
import { buildCertificatePdfData } from "@/lib/certificate/build-pdf-data";
import type { CertificateEventContext } from "@/lib/certificate/build-pdf-data";
import type { ParticipantRow } from "@/components/admin/participants-columns";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<ParticipantRow["status"], string> = {
  pending: "Awaiting payment",
  confirmed: "Confirmed",
  waitlisted: "On waitlist",
  cancelled: "Cancelled",
};

const KIND_LABELS: Record<string, string> = {
  participant: "Participant",
  vip: "VIP",
  speaker: "Speaker",
  sponsor: "Sponsor",
  exhibitor: "Exhibitor",
  media: "Media",
};

type Props = {
  participant: ParticipantRow | null;
  certificateEvent: CertificateEventContext | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canDownloadCertificate?: boolean;
};

export function RegistrationDetailSheet({
  participant,
  certificateEvent,
  open,
  onOpenChange,
  canDownloadCertificate = false,
}: Props) {
  const hasCert = Boolean(participant?.certificateNumber);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto sm:max-w-md"
      >
        {participant ? (
          <>
            <SheetHeader>
              <SheetTitle>{participant.fullName}</SheetTitle>
              <SheetDescription>
                {participant.ticketTypeName}
                {KIND_LABELS[participant.ticketKind]
                  ? ` · ${KIND_LABELS[participant.ticketKind]}`
                  : ""}
              </SheetDescription>
              <Badge
                variant={
                  participant.status === "confirmed"
                    ? "default"
                    : participant.status === "waitlisted"
                      ? "outline"
                      : "secondary"
                }
                className="w-fit"
              >
                {STATUS_LABELS[participant.status]}
              </Badge>
            </SheetHeader>

            <dl className="grid gap-3 px-4 text-sm">
              <DetailRow label="Email" value={participant.email} />
              <DetailRow label="Phone" value={participant.phone} />
              <DetailRow
                label="Organization"
                value={participant.organization ?? "—"}
              />
              <DetailRow label="Position" value={participant.position ?? "—"} />
              <DetailRow label="Pass type" value={participant.ticketTypeName} />
              <DetailRow
                label="Reference"
                value={participant.confirmationCode}
                mono
              />
              <DetailRow
                label="Registered"
                value={new Date(participant.createdAt).toLocaleString()}
              />
              {hasCert && participant.certificateNumber ? (
                <>
                  <DetailRow
                    label="Certificate no."
                    value={participant.certificateNumber}
                    mono
                  />
                  {participant.certificateIssuedAt ? (
                    <DetailRow
                      label="Certificate issued"
                      value={new Date(
                        participant.certificateIssuedAt
                      ).toLocaleString()}
                    />
                  ) : null}
                </>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  No certificate issued yet.
                </div>
              )}
            </dl>

            <SheetFooter className="flex-col gap-2 sm:flex-col sm:items-stretch">
              {canDownloadCertificate &&
              hasCert &&
              participant.certificateNumber &&
              participant.certificateIssuedAt &&
              certificateEvent ? (
                <CertificatePdfDownload
                  className="w-full"
                  data={buildCertificatePdfData(
                    {
                      fullName: participant.fullName,
                      organization: participant.organization,
                      position: participant.position,
                      ticketTypeName: participant.ticketTypeName,
                      certificateNumber: participant.certificateNumber,
                      certificateIssuedAt: participant.certificateIssuedAt,
                    },
                    certificateEvent
                  )}
                />
              ) : null}
              <Button
                variant="outline"
                className="w-full"
                nativeButton={false}
                render={
                  <Link
                    href={`/registration/${encodeURIComponent(participant.confirmationCode)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <ExternalLink className="size-4" />
                Open public status page
              </Button>
            </SheetFooter>
          </>
        ) : (
          <SheetHeader>
            <SheetTitle>Registration</SheetTitle>
          </SheetHeader>
        )}
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-right font-medium",
          mono && "font-mono text-xs break-all"
        )}
      >
        {value}
      </dd>
    </div>
  );
}
