"use client";

import { useEffect } from "react";
import { useRegistrationFlow } from "@/components/registration/registration-flow-provider";

/** Opens the registration dialog flow when visiting /register/[slug]. */
export function EventRegistrationLoader({ slug: _slug }: { slug: string }) {
  const { openRegistration, isLoading } = useRegistrationFlow();

  useEffect(() => {
    if (!isLoading) {
      openRegistration();
    }
  }, [isLoading, openRegistration]);

  return (
    <p className="py-24 text-center text-sm text-muted-foreground">
      {isLoading ? "Loading registration…" : "Choose your pass type in the dialog above."}
    </p>
  );
}
