"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { AddStaffDialog } from "@/components/admin/add-staff-dialog";
import { StaffTable } from "@/components/admin/staff-table";
import { Button } from "@/components/ui/button";
import { useStaffSession } from "@/components/auth/session-provider";

export function StaffPanel() {
  const { sessionToken } = useStaffSession();
  const backfillStaffIds = useMutation(api.auth.backfillStaffIds);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!sessionToken) return;
    void backfillStaffIds({ sessionToken }).catch(() => {
      /* ignore */
    });
  }, [sessionToken, backfillStaffIds]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add staff
        </Button>
      </div>
      <StaffTable />
      <AddStaffDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
