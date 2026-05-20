"use client";

import { useRegistrationFlow } from "@/components/registration/registration-flow-provider";

export function FooterRegisterLink() {
  const { openRegistration } = useRegistrationFlow();

  return (
    <button
      type="button"
      onClick={() => openRegistration()}
      className="text-left hover:text-foreground"
    >
      Register
    </button>
  );
}
