"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaffSession } from "@/components/auth/session-provider";
import { formatPrice } from "@/lib/format-price";

type PendingRow = Doc<"registrations"> & {
  ticketTypeName: string;
  price: number;
  currency: string;
};

type Props = {
  pending: PendingRow[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RecordPaymentDialog({
  pending,
  open,
  onOpenChange,
}: Props) {
  const { sessionToken } = useStaffSession();
  const recordManual = useMutation(api.payments.recordManualPayment);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [method, setMethod] = useState<"momo" | "card" | "bank" | "other">(
    "bank"
  );
  const [externalReference, setExternalReference] = useState("");
  const [busy, setBusy] = useState(false);

  const selected = pending.find((p) => p.confirmationCode === confirmationCode);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionToken || !selected) return;
    setBusy(true);
    try {
      await recordManual({
        sessionToken,
        confirmationCode: selected.confirmationCode,
        amount: selected.price,
        currency: selected.currency,
        method,
        externalReference: externalReference.trim() || undefined,
      });
      toast.success("Payment recorded", {
        description: `${selected.fullName} is now confirmed.`,
      });
      onOpenChange(false);
      setConfirmationCode("");
      setExternalReference("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not record payment");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record manual payment</DialogTitle>
          <DialogDescription>
            Confirm a pending registration after bank transfer or office payment.
          </DialogDescription>
        </DialogHeader>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No registrations are awaiting payment for this edition. Only attendees
            with status <span className="font-medium">pending</span> can be
            confirmed here.
          </p>
        ) : (
        <form className="grid gap-4" onSubmit={(e) => void onSubmit(e)}>
          <div className="grid gap-2">
            <Label>Pending registration</Label>
            <Select
              value={confirmationCode || undefined}
              items={pending.map((p) => ({
                value: p.confirmationCode,
                label: `${p.fullName} · ${p.confirmationCode}`,
              }))}
              onValueChange={(v) => setConfirmationCode(v ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select attendee" />
              </SelectTrigger>
              <SelectContent>
                {pending.map((p) => (
                  <SelectItem key={p._id} value={p.confirmationCode}>
                    {p.fullName} · {p.confirmationCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selected ? (
            <p className="text-sm text-muted-foreground">
              {selected.ticketTypeName} ·{" "}
              {formatPrice(selected.price, selected.currency)}
            </p>
          ) : null}
          <div className="grid gap-2">
            <Label>Payment method</Label>
            <Select
              value={method}
              onValueChange={(v) =>
                setMethod(v as "momo" | "card" | "bank" | "other")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank transfer</SelectItem>
                <SelectItem value="momo">Mobile money</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payment-ref">Reference (optional)</Label>
            <Input
              id="payment-ref"
              value={externalReference}
              onChange={(e) => setExternalReference(e.target.value)}
              placeholder="Transaction ID or receipt number"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selected || busy}>
              {busy ? "Saving…" : "Confirm payment"}
            </Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
