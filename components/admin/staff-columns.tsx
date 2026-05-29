"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { StaffRole } from "@/lib/auth/types";

export type StaffMemberRow = {
  _id: Id<"users">;
  staffId: string | null;
  email: string;
  name: string;
  contact: string | null;
  role: StaffRole;
  isActive: boolean;
  createdAt: number;
};

const ROLE_LABELS: Record<StaffRole, string> = {
  admin: "Admin",
  finance: "Finance",
};

const EDITABLE_ROLES: StaffRole[] = ["admin", "finance"];

type StaffColumnsOptions = {
  currentUserId?: Id<"users">;
  onRoleChange: (userId: Id<"users">, role: StaffRole) => void;
  updatingUserId: Id<"users"> | null;
};

export function canSelectStaff(
  member: StaffMemberRow,
  currentUserId?: Id<"users">
) {
  return member.role !== "admin" && member._id !== currentUserId;
}

export function getStaffColumns({
  currentUserId,
  onRoleChange,
  updatingUserId,
}: StaffColumnsOptions): ColumnDef<StaffMemberRow>[] {
  return [
    {
      id: "select",
      header: ({ table }) => {
        const selectableRows = table
          .getRowModel()
          .rows.filter((row) => canSelectStaff(row.original, currentUserId));
        const allSelected =
          selectableRows.length > 0 &&
          selectableRows.every((row) => row.getIsSelected());
        const someSelected = selectableRows.some((row) => row.getIsSelected());

        return (
          <Checkbox
            checked={allSelected}
            indeterminate={someSelected && !allSelected}
            disabled={selectableRows.length === 0}
            onCheckedChange={(value) => {
              for (const row of selectableRows) {
                row.toggleSelected(!!value);
              }
            }}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => {
        if (!canSelectStaff(row.original, currentUserId)) {
          return null;
        }
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "staffId",
      meta: { label: "Staff ID" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Staff ID" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium">
          {row.getValue("staffId") ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "name",
      meta: { label: "Name" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      filterFn: (row, _id, value) => {
        const q = String(value).toLowerCase();
        const m = row.original;
        return (
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          (m.staffId?.toLowerCase().includes(q) ?? false) ||
          (m.contact?.toLowerCase().includes(q) ?? false)
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
      accessorKey: "contact",
      meta: { label: "Contact" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Contact" />
      ),
      cell: ({ row }) => row.getValue("contact") ?? "—",
    },
    {
      accessorKey: "role",
      meta: { label: "Role" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const member = row.original;
        const isUpdating = updatingUserId === member._id;

        if (member._id === currentUserId) {
          return (
            <Badge variant="secondary">{ROLE_LABELS[member.role]}</Badge>
          );
        }

        return (
          <Select
            value={member.role}
            disabled={isUpdating}
            onValueChange={(value) =>
              onRoleChange(member._id, value as StaffRole)
            }
          >
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EDITABLE_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
      filterFn: (row, id, value) => {
        if (!value || value === "all") return true;
        return row.getValue(id) === value;
      },
    },
    {
      accessorKey: "isActive",
      meta: { label: "Status" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const active = row.getValue("isActive") as boolean;
        return (
          <Badge variant={active ? "default" : "secondary"}>
            {active ? "Active" : "Inactive"}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return String(row.getValue(id)) === value;
      },
    },
    {
      accessorKey: "createdAt",
      meta: { label: "Created" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) =>
        new Date(row.getValue("createdAt") as number).toLocaleDateString(),
    },
  ];
}
