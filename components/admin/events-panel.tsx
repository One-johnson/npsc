"use client";

import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Doc } from "@/convex/_generated/dataModel";
import { DuplicateEventSheet } from "@/components/admin/duplicate-event-sheet";
import { EventDetailSheet } from "@/components/admin/event-detail-sheet";
import { EventFormSheet } from "@/components/admin/event-form-sheet";
import { EventsTable } from "@/components/admin/events-table";
import { Button } from "@/components/ui/button";
import { useStaffSession } from "@/components/auth/session-provider";

export function EventsPanel() {
  const { user, sessionToken } = useStaffSession();
  const canManage = user?.role === "admin";

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [detailOpen, setDetailOpen] = useState(false);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Doc<"events"> | null>(
    null
  );

  const openCreate = useCallback(() => {
    setSelectedEvent(null);
    setFormMode("create");
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((event: Doc<"events">) => {
    setSelectedEvent(event);
    setFormMode("edit");
    setDetailOpen(false);
    setFormOpen(true);
  }, []);

  const openDetail = useCallback((event: Doc<"events">) => {
    setSelectedEvent(event);
    setDetailOpen(true);
  }, []);

  const openDuplicate = useCallback((event: Doc<"events">) => {
    setSelectedEvent(event);
    setDetailOpen(false);
    setDuplicateOpen(true);
  }, []);

  const handleSaved = useCallback(() => {
    toast.success(formMode === "create" ? "Event created" : "Event updated");
  }, [formMode]);

  return (
    <div className="space-y-4">
      {canManage ? (
        <div className="flex justify-end">
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            Create event
          </Button>
        </div>
      ) : null}

      <EventsTable
        canManage={canManage}
        onRowClick={openDetail}
        onEdit={openEdit}
        onDuplicate={openDuplicate}
        onView={openDetail}
      />

      {sessionToken ? (
        <>
          <EventFormSheet
            open={formOpen}
            onOpenChange={setFormOpen}
            sessionToken={sessionToken}
            mode={formMode}
            event={selectedEvent}
            onSaved={handleSaved}
          />
          <EventDetailSheet
            event={selectedEvent}
            open={detailOpen}
            onOpenChange={setDetailOpen}
            canManage={canManage}
            onEdit={openEdit}
            onDuplicate={openDuplicate}
          />
          <DuplicateEventSheet
            source={selectedEvent}
            open={duplicateOpen}
            onOpenChange={setDuplicateOpen}
            sessionToken={sessionToken}
            onDuplicated={() =>
              toast.success("New edition created — update dates and publish when ready")
            }
          />
        </>
      ) : null}
    </div>
  );
}
