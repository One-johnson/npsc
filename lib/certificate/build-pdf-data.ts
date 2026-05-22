import type { CertificatePdfData } from "@/components/certificate/certificate-pdf-document";

export type CertificateEventContext = {
  titleLine2: string;
  edition: string;
  date: string;
  venue: string;
  city: string;
};

export type CertificateParticipantContext = {
  fullName: string;
  organization?: string;
  position?: string;
  ticketTypeName: string;
  certificateNumber: string;
  certificateIssuedAt: number;
};

export function buildCertificatePdfData(
  participant: CertificateParticipantContext,
  event: CertificateEventContext
): CertificatePdfData {
  return {
    attendeeName: participant.fullName,
    organization: participant.organization,
    position: participant.position,
    passName: participant.ticketTypeName,
    certificateNumber: participant.certificateNumber,
    eventTitleLine2: event.titleLine2,
    edition: event.edition,
    date: event.date,
    venue: event.venue,
    city: event.city,
    issuedAtLabel: new Date(participant.certificateIssuedAt).toLocaleDateString(
      undefined,
      { year: "numeric", month: "long", day: "numeric" }
    ),
  };
}
