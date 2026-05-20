"use client";

import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { useRegistrationFlow } from "@/components/registration/registration-flow-provider";

type Props = ComponentProps<typeof Button> & {
  /** Pre-select ticket kind: participant, vip, speaker, sponsor, exhibitor, media */
  ticketKind?: string;
};

/** Opens conference registration: choose pass type → form → payment. */
export function RegisterButton({
  ticketKind,
  children = "Register now",
  onClick,
  disabled,
  ...props
}: Props) {
  const { openRegistration } = useRegistrationFlow();

  return (
    <Button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          openRegistration(ticketKind);
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
