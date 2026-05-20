"use client";

import { useCallback, useMemo, useState } from "react";
import type { Table } from "@tanstack/react-table";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import {
  getEventsColumns,
  type EventRow,
} from "@/components/admin/events-columns";
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

type Props = {
  canManage?: boolean;
  onRowClick?: (event: Doc<"events">) => void;
  onEdit?: (event: Doc<"events">) => void;
  onDuplicate?: (event: Doc<"events">) => void;
  onView?: (event: Doc<"events">) => void;
  enableBulkDelete?: boolean;
};

export function EventsTable(props: Props) {
  const {
    canManage = false,
    onRowClick,
    onEdit,
    onDuplicate,
    onView,
    enableBulkDelete = true,
  } = props;

  const { sessionToken } = useStaffSession();
  const events = useQuery(
    api.events.list,
    sessionToken ? { sessionToken } : "skip"
  );
  const bulkDeleteEvents = useMutation(api.events.bulkDelete);
  const removeEvent = useMutation(api.events.remove);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<Id<"events"> | null>(null);

  const handleDelete = useCallback(
    async (event: EventRow) => {
      if (!sessionToken || !canManage) return;
      const confirmed = window.confirm(
        `Delete "${event.titleLine2}"? This removes all ticket types and registrations.`
      );
      if (!confirmed) return;

      setDeletingId(event._id);
      try {
        await removeEvent({ sessionToken, eventId: event._id });
        toast.success("Event deleted");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Delete failed");
      } finally {
        setDeletingId(null);
      }
    },
    [sessionToken, canManage, removeEvent]
  );

  const columns = useMemo(
    () =>
      getEventsColumns({
        enableSelection: enableBulkDelete && canManage,
        canManage,
        onView,
        onEdit,
        onDuplicate,
        onDelete: (event) => void handleDelete(event),
        deletingId,
      }),
    [
      enableBulkDelete,
      canManage,
      onView,
      onEdit,
      onDuplicate,
      handleDelete,
      deletingId,
    ]
  );

  const data = useMemo((): EventRow[] => {
    if (!events) return [];
    return events.filter((event) => {
      if (statusFilter === "published" && !event.isPublished) return false;
      if (statusFilter === "draft" && event.isPublished) return false;
      return true;
    });
  }, [events, statusFilter]);

  const getRowId = useCallback((row: EventRow) => row._id, []);

  const handleBulkDelete = useCallback(
    async (rows: EventRow[]) => {
      if (!sessionToken || !canManage) return;
      setDeleting(true);
      try {
        const result = await bulkDeleteEvents({
          sessionToken,
          eventIds: rows.map((row) => row._id as Id<"events">),
        });
        if (result.deleted === 0) {
          throw new Error("No events were deleted");
        }
        toast.success(
          `Deleted ${result.deleted} event${result.deleted === 1 ? "" : "s"}`
        );
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Delete failed");
        throw e;
      } finally {
        setDeleting(false);
      }
    },
    [sessionToken, canManage, bulkDeleteEvents]
  );

  const toolbarActions = useMemo(() => {
    if (!enableBulkDelete || !canManage) return undefined;
    return (table: Table<EventRow>) => (
      <DataTableBulkDelete
        table={table}
        entityName="event"
        onDelete={handleBulkDelete}
        disabled={deleting}
      />
    );
  }, [enableBulkDelete, canManage, handleBulkDelete, deleting]);

  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={getRowId}
      filterColumnId="title"
      filterPlaceholder="Search events…"
      isLoading={events === undefined}
      emptyMessage={
        canManage
          ? "No events yet. Create your first event."
          : "No events found."
      }
      onRowClick={onRowClick ?? undefined}
      renderToolbarActions={toolbarActions}
      toolbarChildren={
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v ?? "all")}
        >
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      }
    />
  );
}
