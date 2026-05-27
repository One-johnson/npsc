"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useRegistrationFlow } from "@/components/registration/registration-flow-provider";

type Props = ComponentProps<typeof Button> & {
  /** Pre-select ticket kind: participant, student, exhibitor (exhibition package) */
  ticketKind?: string;
  /** Override label (default: Register or Join waitlist). */
  children?: React.ReactNode;
};

const DEFAULT_PARTICIPANT_KIND = "participant";

/** Opens conference registration: choose pass type → form → payment (or waitlist). */
export function RegisterButton({
  ticketKind,
  children,
  onClick,
  disabled,
  variant,
  ...props
}: Props) {
  const { openRegistration, allTicketTypesSoldOut, isLoading } =
    useRegistrationFlow();

  const isWaitlistCta = allTicketTypesSoldOut;
  const label = isWaitlistCta
    ? "Join waitlist"
    : (children ?? "Register");

  return (
    <Button
      type="button"
      disabled={disabled || isLoading}
      variant={variant ?? (isWaitlistCta ? "outline" : "default")}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          openRegistration(
            ticketKind ?? (isWaitlistCta ? DEFAULT_PARTICIPANT_KIND : undefined)
          );
        }
      }}
      {...props}
    >
      {label}
    </Button>
  );
}
