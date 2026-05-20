"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  Copy,
  MoreHorizontal,
  Pencil,
  Trash2,
  Ticket,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

export type EventRow = Doc<"events">;

type EventsColumnsOptions = {
  enableSelection?: boolean;
  canManage?: boolean;
  onView?: (event: EventRow) => void;
  onEdit?: (event: EventRow) => void;
  onDuplicate?: (event: EventRow) => void;
  onDelete?: (event: EventRow) => void;
  deletingId?: Id<"events"> | null;
};

export function getEventsColumns(
  options?: EventsColumnsOptions
): ColumnDef<EventRow>[] {
  const enableSelection = options?.enableSelection ?? true;
  const canManage = options?.canManage ?? false;

  const selectColumn: ColumnDef<EventRow> = {
    id: "select",
    header: ({ table }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  };

  return [
    ...(enableSelection ? [selectColumn] : []),
    {
      id: "title",
      accessorFn: (row) => row.titleLine2,
      meta: { label: "Event" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Event" />
      ),
      cell: ({ row }) => {
        const event = row.original;
        return (
          <div>
            <p className="font-medium">{event.titleLine2}</p>
            <p className="text-xs text-muted-foreground">{event.edition}</p>
          </div>
        );
      },
      filterFn: (row, _id, value) => {
        const q = String(value).toLowerCase();
        const event = row.original;
        return (
          event.titleLine2.toLowerCase().includes(q) ||
          event.edition.toLowerCase().includes(q) ||
          event.slug.toLowerCase().includes(q) ||
          event.title.toLowerCase().includes(q)
        );
      },
    },
    {
      accessorKey: "slug",
      meta: { label: "Slug" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Slug" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.getValue("slug")}</span>
      ),
    },
    {
      accessorKey: "isPublished",
      meta: { label: "Status" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const published = row.getValue("isPublished") as boolean;
        return (
          <Badge variant={published ? "default" : "secondary"}>
            {published ? "Published" : "Draft"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "capacity",
      meta: { label: "Capacity" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Capacity" />
      ),
    },
    {
      accessorKey: "registeredCount",
      meta: { label: "Registered" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Registered" />
      ),
    },
    {
      accessorKey: "updatedAt",
      meta: { label: "Updated" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Updated" />
      ),
      cell: ({ row }) =>
        new Date(row.getValue("updatedAt") as number).toLocaleDateString(),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const event = row.original;
        const eventId = event._id as Id<"events">;
        const isDeleting = options?.deletingId === eventId;

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-8"
                    disabled={isDeleting}
                  />
                }
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => options?.onView?.(event)}
                >
                  <Eye className="size-4" />
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={
                    <Link
                      href={`/admin/events/${eventId}`}
                      className="flex w-full items-center gap-1.5"
                    />
                  }
                >
                  <Ticket className="size-4" />
                  Tickets & registrations
                </DropdownMenuItem>
                {canManage ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => options?.onEdit?.(event)}
                    >
                      <Pencil className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => options?.onDuplicate?.(event)}
                    >
                      <Copy className="size-4" />
                      Duplicate for next year
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => options?.onDelete?.(event)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
