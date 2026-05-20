"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { PaymentsTable } from "@/components/admin/payments-table";
import { RecordPaymentDialog } from "@/components/admin/record-payment-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useStaffSession } from "@/components/auth/session-provider";
import { formatEditionSelectLabel } from "@/lib/event/slug-year";
import { formatPrice } from "@/lib/format-price";

export function PaymentsPanel() {
  const { sessionToken } = useStaffSession();
  const events = useQuery(
    api.events.list,
    sessionToken ? { sessionToken } : "skip"
  );

  const [eventId, setEventId] = useState<Id<"events"> | null>(null);
  const [recordOpen, setRecordOpen] = useState(false);

  useEffect(() => {
    if (!events?.length || eventId) return;
    setEventId(events[0]._id);
  }, [events, eventId]);

  const payments = useQuery(
    api.payments.listForAdmin,
    sessionToken && eventId ? { sessionToken, eventId } : "skip"
  );

  const pending = useQuery(
    api.payments.listPendingForAdmin,
    sessionToken && eventId ? { sessionToken, eventId } : "skip"
  );

  const editionSelectItems = useMemo(
    () =>
      (events ?? []).map((event) => ({
        value: event._id,
        label: formatEditionSelectLabel(event),
      })),
    [events]
  );

  const totals = useMemo(() => {
    if (!payments) return null;
    const completed = payments.filter((p) => p.status === "completed");
    const sum = completed.reduce((s, p) => s + p.amount, 0);
    return { count: completed.length, sum, currency: completed[0]?.currency ?? "GHS" };
  }, [payments]);

  if (events === undefined) {
    return <p className="text-sm text-muted-foreground">Loading events…</p>;
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No events yet. Create an event to view payments.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end gap-3">
        <div className="grid gap-2">
          <span className="text-sm font-medium">Edition</span>
          <Select
            value={eventId ?? ""}
            items={editionSelectItems}
            onValueChange={(v) => {
              if (!v) return;
              setEventId(v as Id<"events">);
            }}
          >
            <SelectTrigger className="h-9 w-[min(100%,280px)]">
              <SelectValue placeholder="Select edition" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event._id} value={event._id}>
                  {formatEditionSelectLabel(event)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          disabled={!eventId || pending === undefined}
          onClick={() => setRecordOpen(true)}
        >
          Record manual payment
        </Button>
      </div>

      {totals ? (
        <p className="text-sm text-muted-foreground">
          {totals.count} completed payment{totals.count === 1 ? "" : "s"} ·{" "}
          {formatPrice(totals.sum, totals.currency)} collected
          {pending && pending.length > 0
            ? ` · ${pending.length} awaiting payment`
            : ""}
        </p>
      ) : null}

      <PaymentsTable payments={payments} pendingCount={pending?.length ?? 0} />

      {eventId && pending !== undefined ? (
        <RecordPaymentDialog
          pending={pending}
          open={recordOpen}
          onOpenChange={setRecordOpen}
        />
      ) : null}
    </div>
  );
}
