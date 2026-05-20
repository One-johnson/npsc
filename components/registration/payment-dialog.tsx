"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format-price";
import type { PublicEventBundle } from "@/lib/event/types";
import type { PendingRegistration } from "@/lib/registration-storage";
import {
  paymentSchema,
  type PaymentData,
} from "@/lib/validations/registration";

type Props = {
  bundle: PublicEventBundle;
  registration: PendingRegistration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: PaymentData) => void | Promise<void>;
};

export function PaymentDialog({
  bundle,
  registration,
  open,
  onOpenChange,
  onComplete,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { paymentMethod: "momo" },
  });

  const method = form.watch("paymentMethod");

  async function onSubmit(_data: PaymentData) {
    setError(null);
    setSubmitting(true);
    try {
      await onComplete(_data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 p-6 sm:max-w-2xl sm:p-8">
        <DialogHeader>
          <DialogTitle>Complete payment</DialogTitle>
          <DialogDescription>
            {registration.fullName} · {registration.ticketTypeName} · Hubtel
            secure checkout
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">
              {registration.ticketTypeName}
            </span>
            <span className="shrink-0 font-semibold">
              {registration.price > 0
                ? formatPrice(registration.price, registration.currency)
                : "Complimentary"}
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t border-border/60 pt-2">
            <span className="font-medium">Total due</span>
            <span className="text-lg font-bold text-primary">
              {registration.price > 0
                ? formatPrice(registration.price, registration.currency)
                : "GHS 0"}
            </span>
          </div>
        </div>

        <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
          <p className="text-sm font-medium">Payment method</p>
          {(
            [
              { id: "momo" as const, label: "Mobile Money" },
              { id: "card" as const, label: "Debit / Credit card" },
              { id: "bank" as const, label: "Bank transfer" },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => form.setValue("paymentMethod", m.id)}
              className={cn(
                "flex w-full rounded-lg border p-3 text-left text-sm transition-colors",
                method === m.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted/50"
              )}
            >
              {m.label}
            </button>
          ))}
          {form.formState.errors.paymentMethod ? (
            <p className="text-sm text-destructive">
              {form.formState.errors.paymentMethod.message}
            </p>
          ) : null}
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <DialogFooter className="px-0 pb-0 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Processing…" : "Pay now"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
