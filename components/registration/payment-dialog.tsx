"use client";

import { Button } from "@/components/ui/button";
import {
  RegistrationModal,
  RegistrationModalBackButton,
  RegistrationModalBody,
  RegistrationModalDescription,
  RegistrationModalFooter,
  RegistrationModalHeader,
  RegistrationModalTitle,
} from "@/components/registration/registration-modal";
import { ManualMoMoPaymentInstructions } from "@/components/payments/manual-momo-payment-instructions";
import { formatPrice } from "@/lib/format-price";
import type { PublicEventBundle } from "@/lib/event/types";
import type { PendingRegistration } from "@/lib/registration-storage";

type Props = {
  bundle: PublicEventBundle;
  registration: PendingRegistration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBack?: () => void;
  onDone: () => void;
};

export function PaymentDialog({
  bundle: _bundle,
  registration,
  open,
  onOpenChange,
  onBack,
  onDone,
}: Props) {
  const referenceCode = registration.confirmationCode;

  return (
    <RegistrationModal
      open={open}
      onOpenChange={onOpenChange}
      className="gap-6 p-6 sm:max-w-2xl sm:p-8"
    >
      {onBack ? <RegistrationModalBackButton onBack={onBack} /> : null}
      <RegistrationModalHeader>
        <RegistrationModalTitle>Complete your payment</RegistrationModalTitle>
        <RegistrationModalDescription>
          {registration.fullName} · {registration.ticketTypeName}
          {registration.price > 0
            ? ` · ${formatPrice(registration.price, registration.currency)}`
            : ""}
        </RegistrationModalDescription>
      </RegistrationModalHeader>

      <RegistrationModalBody className="grid gap-4">
        <ManualMoMoPaymentInstructions
          amount={registration.price}
          currency={registration.currency}
          referenceCode={referenceCode}
          showSteps
        />
        <p className="text-xs text-muted-foreground">
          Your registration stays pending until GIPS verifies your MoMo payment.
          Keep your reference code to check status later.
        </p>

        <RegistrationModalFooter className="px-0 pb-0 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button type="button" onClick={onDone}>
            View registration status
          </Button>
        </RegistrationModalFooter>
      </RegistrationModalBody>
    </RegistrationModal>
  );
}
