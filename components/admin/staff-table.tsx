"use client";

import { useCallback, useMemo, useState } from "react";
import type { Table } from "@tanstack/react-table";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  canSelectStaff,
  getStaffColumns,
  type StaffMemberRow,
} from "@/components/admin/staff-columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableBulkDelete } from "@/components/data-table/data-table-bulk-delete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaffSession } from "@/components/auth/session-provider";
import type { StaffRole } from "@/lib/auth/types";

export function StaffTable() {
  const { sessionToken, user } = useStaffSession();
  const staff = useQuery(
    api.auth.listStaff,
    sessionToken ? { sessionToken } : "skip"
  );
  const updateStaff = useMutation(api.auth.updateStaffUser);
  const bulkDeleteStaff = useMutation(api.auth.bulkDeleteStaff);

  const [deleting, setDeleting] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<Id<"users"> | null>(
    null
  );
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const currentUserId = user?._id as Id<"users"> | undefined;

  const handleRoleChange = useCallback(
    async (userId: Id<"users">, role: StaffRole) => {
      if (!sessionToken) return;
      setUpdatingUserId(userId);
      try {
        await updateStaff({ sessionToken, userId, role });
      } catch {
        /* table will revert on next query refresh */
      } finally {
        setUpdatingUserId(null);
      }
    },
    [sessionToken, updateStaff]
  );

  const handleBulkDelete = useCallback(
    async (rows: StaffMemberRow[]) => {
      if (!sessionToken) return;

      const userIds = rows
        .filter((row) => canSelectStaff(row, currentUserId))
        .map((row) => row._id);

      if (userIds.length === 0) {
        throw new Error(
          "No deletable staff selected (admin accounts and your own account cannot be removed)"
        );
      }

      setDeleting(true);
      try {
        const result = await bulkDeleteStaff({ sessionToken, userIds });
        if (result.deleted === 0) {
          throw new Error(
            result.skipped > 0
              ? "Selected accounts could not be deleted"
              : "No staff were deleted"
          );
        }
      } finally {
        setDeleting(false);
      }
    },
    [sessionToken, currentUserId, bulkDeleteStaff]
  );

  const columns = useMemo(
    () =>
      getStaffColumns({
        currentUserId,
        onRoleChange: handleRoleChange,
        updatingUserId,
      }),
    [currentUserId, handleRoleChange, updatingUserId]
  );

  const data = useMemo((): StaffMemberRow[] => {
    if (!staff) return [];
    return staff.filter((member) => {
      if (roleFilter !== "all" && member.role !== roleFilter) return false;
      if (statusFilter === "active" && !member.isActive) return false;
      if (statusFilter === "inactive" && member.isActive) return false;
      return true;
    }) as StaffMemberRow[];
  }, [staff, roleFilter, statusFilter]);

  const getRowId = useCallback((row: StaffMemberRow) => row._id, []);

  const toolbarActions = useMemo(
    () => (table: Table<StaffMemberRow>) => (
      <DataTableBulkDelete
        table={table}
        entityName="staff member"
        onDelete={handleBulkDelete}
        disabled={deleting}
      />
    ),
    [handleBulkDelete, deleting]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={getRowId}
      filterColumnId="name"
      filterPlaceholder="Search name, email, ID, contact…"
      isLoading={staff === undefined}
      emptyMessage="No staff members found."
      renderToolbarActions={toolbarActions}
      toolbarChildren={
        <>
          <Select
            value={roleFilter}
            onValueChange={(v) => setRoleFilter(v ?? "all")}
          >
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="checkin">Check-in</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v ?? "all")}
          >
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </>
      }
    />
  );
}
