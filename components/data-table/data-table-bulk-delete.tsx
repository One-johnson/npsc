"use client";

import { useState } from "react";
import type { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DataTableBulkDeleteProps<TData> {
  table: Table<TData>;
  entityName: string;
  onDelete: (rows: TData[]) => Promise<void>;
  disabled?: boolean;
}

export function DataTableBulkDelete<TData>({
  table,
  entityName,
  onDelete,
  disabled = false,
}: DataTableBulkDeleteProps<TData>) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const count = selectedRows.length;

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      await onDelete(selectedRows.map((row) => row.original));
      table.resetRowSelection();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className="h-8"
        disabled={disabled || count === 0}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        <Trash2 className="mr-2 size-4" />
        Delete{count > 0 ? ` (${count})` : ""}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Delete {count} {entityName}
              {count === 1 ? "" : "s"}?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. Related data (ticket types,
              registrations, or sessions) will be removed as well.
            </DialogDescription>
          </DialogHeader>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={loading}
              onClick={() => void handleConfirm()}
            >
              {loading ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
