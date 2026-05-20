"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { PaymentDialog } from "@/components/registration/payment-dialog";
import type { PaymentData } from "@/lib/validations/registration";
import { Button } from "@/components/ui/button";
import type { PublicEventBundle } from "@/lib/event/types";
import type { PendingRegistration } from "@/lib/registration-storage";

type Props = {
  bundle: PublicEventBundle;
  registration: PendingRegistration;
  autoOpen?: boolean;
};

export function TicketPendingPayment({
  bundle,
  registration,
  autoOpen = false,
}: Props) {
  const router = useRouter();
  const confirmPayment = useMutation(api.payments.confirmRegistrationPayment);
  const [open, setOpen] = useState(autoOpen);
  const [submitting, setSubmitting] = useState(false);

  async function handlePaymentComplete(payment: PaymentData) {
    if (!registration.confirmationCode) {
      throw new Error("Missing confirmation code");
    }
    setSubmitting(true);
    try {
      const result = await confirmPayment({
        confirmationCode: registration.confirmationCode,
        amount: registration.price,
        currency: registration.currency,
        method: payment.paymentMethod,
        provider: "mock",
      });
      if (!result.alreadyConfirmed) {
        toast.success("Payment received — registration confirmed");
      }
      setOpen(false);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Button
        className="mt-6 w-full"
        size="lg"
        onClick={() => setOpen(true)}
        disabled={submitting}
      >
        {submitting ? "Processing…" : "Complete payment"}
      </Button>
      <PaymentDialog
        bundle={bundle}
        registration={registration}
        open={open}
        onOpenChange={setOpen}
        onComplete={(payment) => handlePaymentComplete(payment)}
      />
    </>
  );
}
