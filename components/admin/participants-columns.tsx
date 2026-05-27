"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { CertificatePdfDownload } from "@/components/certificate/certificate-pdf-download";
import { buildCertificatePdfData } from "@/lib/certificate/build-pdf-data";
import type { CertificateEventContext } from "@/lib/certificate/build-pdf-data";
import {
  Award,
  Eye,
  MoreHorizontal,
  TrendingUp,
  XCircle,
} from "lucide-react";

export type ParticipantRow = {
  _id: Id<"registrations">;
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  position?: string;
  status: "pending" | "confirmed" | "waitlisted" | "cancelled";
  ticketKind: string;
  ticketTypeName: string;
  confirmationCode: string;
  createdAt: number;
  eventSlug: string;
  certificateNumber: string | null;
  certificateIssuedAt: number | null;
  studentIdUrl: string | null;
};

const KIND_LABELS: Record<string, string> = {
  participant: "Participant",
  vip: "International",
  speaker: "Speaker",
  sponsor: "Sponsor",
  exhibitor: "Exhibition Package",
  student: "Student",
  media: "Media",
};

type ColumnOptions = {
  canPromote: boolean;
  canManageCertificates: boolean;
  canDownloadCertificate: boolean;
  certificateEvent: CertificateEventContext | null;
  onPromote?: (id: Id<"registrations">) => void;
  onIssueCertificate?: (id: Id<"registrations">) => void;
  onRevokeCertificate?: (id: Id<"registrations">) => void;
  onViewRegistration?: (row: ParticipantRow) => void;
  promotingId?: Id<"registrations"> | null;
  certActionId?: Id<"registrations"> | null;
};

export function getParticipantsColumns(
  options: ColumnOptions
): ColumnDef<ParticipantRow>[] {
  return [
    {
      accessorKey: "fullName",
      meta: { label: "Name" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <p className="font-medium">{row.original.fullName}</p>
      ),
      filterFn: (row, _id, value) => {
        const q = String(value).toLowerCase();
        const r = row.original;
        return (
          r.fullName.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q) ||
          r.confirmationCode.toLowerCase().includes(q) ||
          (r.organization?.toLowerCase().includes(q) ?? false) ||
          (r.position?.toLowerCase().includes(q) ?? false) ||
          (r.certificateNumber?.toLowerCase().includes(q) ?? false)
        );
      },
    },
    {
      accessorKey: "organization",
      meta: { label: "Company / organization" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company / organization" />
      ),
      cell: ({ row }) => row.original.organization ?? "—",
    },
    {
      accessorKey: "position",
      meta: { label: "Position" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Position" />
      ),
      cell: ({ row }) => row.original.position ?? "—",
    },
    {
      id: "studentId",
      meta: { label: "Student ID" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Student ID" />
      ),
      cell: ({ row }) => {
        if (row.original.ticketKind !== "student") {
          return <span className="text-muted-foreground">—</span>;
        }
        const url = row.original.studentIdUrl;
        if (!url) {
          return (
            <span className="text-xs text-muted-foreground">Not uploaded</span>
          );
        }
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View ID
          </a>
        );
      },
    },
    {
      accessorKey: "email",
      meta: { label: "Email" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      id: "ticketType",
      accessorFn: (row) => row.ticketTypeName,
      meta: { label: "Pass type" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Pass type" />
      ),
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{row.original.ticketTypeName}</p>
          <p className="text-xs text-muted-foreground">
            {KIND_LABELS[row.original.ticketKind] ?? row.original.ticketKind}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      meta: { label: "Status" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as ParticipantRow["status"];
        return (
          <Badge
            variant={
              status === "waitlisted"
                ? "outline"
                : status === "cancelled"
                  ? "secondary"
                  : "default"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "certificate",
      meta: { label: "Certificate" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Certificate" />
      ),
      cell: ({ row }) => {
        const num = row.original.certificateNumber;
        if (!num) {
          return <span className="text-xs text-muted-foreground">—</span>;
        }
        return (
          <span className="font-mono text-xs" title="Certificate number">
            {num}
          </span>
        );
      },
    },
    {
      accessorKey: "confirmationCode",
      meta: { label: "Reference" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reference" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.getValue("confirmationCode")}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      meta: { label: "Registered" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Registered" />
      ),
      cell: ({ row }) => {
        const registeredAt = new Date(row.getValue("createdAt") as number);
        return (
          <div className="text-sm whitespace-nowrap">
            <p>{registeredAt.toLocaleDateString()}</p>
            <p className="text-xs text-muted-foreground">
              {registeredAt.toLocaleTimeString()}
            </p>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const p = row.original;
        const isPromoting = options.promotingId === p._id;
        const certBusy = options.certActionId === p._id;
        const hasCert = Boolean(p.certificateNumber);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="size-8" />
              }
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => options.onViewRegistration?.(p)}
              >
                <Eye className="size-4" />
                View registration
              </DropdownMenuItem>
              {options.canManageCertificates &&
              p.status === "confirmed" &&
              !hasCert ? (
                <DropdownMenuItem
                  disabled={certBusy}
                  onClick={() => options.onIssueCertificate?.(p._id)}
                >
                  <Award className="size-4" />
                  {certBusy ? "Issuing…" : "Issue certificate"}
                </DropdownMenuItem>
              ) : null}
              {options.canDownloadCertificate &&
              hasCert &&
              p.certificateNumber &&
              p.certificateIssuedAt &&
              options.certificateEvent ? (
                <DropdownMenuItem
                  render={
                    <CertificatePdfDownload
                      variant="menu"
                      data={buildCertificatePdfData(
                        {
                          fullName: p.fullName,
                          organization: p.organization,
                          position: p.position,
                          ticketTypeName: p.ticketTypeName,
                          certificateNumber: p.certificateNumber,
                          certificateIssuedAt: p.certificateIssuedAt,
                        },
                        options.certificateEvent
                      )}
                    />
                  }
                />
              ) : null}
              {options.canManageCertificates && hasCert ? (
                <DropdownMenuItem
                  disabled={certBusy}
                  onClick={() => options.onRevokeCertificate?.(p._id)}
                >
                  <XCircle className="size-4" />
                  {certBusy ? "Revoking…" : "Revoke certificate"}
                </DropdownMenuItem>
              ) : null}
              {p.status === "waitlisted" && options.canPromote ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={isPromoting}
                    onClick={() => options.onPromote?.(p._id)}
                  >
                    <TrendingUp className="size-4" />
                    {isPromoting ? "Promoting…" : "Promote from waitlist"}
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
