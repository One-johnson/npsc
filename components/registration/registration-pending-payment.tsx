"use client";

import { ManualMoMoPaymentInstructions } from "@/components/payments/manual-momo-payment-instructions";
import type { PendingRegistration } from "@/lib/registration-storage";

type Props = {
  registration: PendingRegistration;
};

export function RegistrationPendingPayment({ registration }: Props) {
  if (!registration.confirmationCode) return null;

  return (
    <ManualMoMoPaymentInstructions
      amount={registration.price}
      currency={registration.currency}
      referenceCode={registration.confirmationCode}
      showSteps
    />
  );
}
