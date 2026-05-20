"use client";

import Link from "next/link";
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
import { ExternalLink, MoreHorizontal, TrendingUp } from "lucide-react";

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
};

const KIND_LABELS: Record<string, string> = {
  participant: "Participant",
  vip: "VIP",
  speaker: "Speaker",
  sponsor: "Sponsor",
  exhibitor: "Exhibitor",
  media: "Media",
};

type ColumnOptions = {
  canPromote: boolean;
  onPromote?: (id: Id<"registrations">) => void;
  promotingId?: Id<"registrations"> | null;
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
          (r.position?.toLowerCase().includes(q) ?? false)
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
      accessorKey: "confirmationCode",
      meta: { label: "Confirmation" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Confirmation" />
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
                render={
                  <Link
                    href={`/ticket/${encodeURIComponent(p.confirmationCode)}`}
                    target="_blank"
                    className="flex w-full items-center gap-1.5"
                  />
                }
              >
                <ExternalLink className="size-4" />
                View ticket
              </DropdownMenuItem>
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
