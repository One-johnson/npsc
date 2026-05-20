"use client";

import { CheckCircle2, Loader2, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type RegistrationFlowOverlayPhase =
  | "registering"
  | "redirecting-to-payment"
  | "processing-payment"
  | "payment-success"
  | "waitlist-complete";

export type RegistrationFlowOverlayState = {
  phase: RegistrationFlowOverlayPhase;
  email?: string;
};

const COPY: Record<
  RegistrationFlowOverlayPhase,
  { title: string; description: string }
> = {
  registering: {
    title: "Saving your registration",
    description: "Please wait while we secure your spot…",
  },
  "redirecting-to-payment": {
    title: "Registration complete",
    description:
      "Your details have been saved. Redirecting you to payment to confirm your pass.",
  },
  "processing-payment": {
    title: "Processing payment",
    description: "Please wait while we confirm your payment…",
  },
  "payment-success": {
    title: "Thank you for registering",
    description:
      "Your registration is confirmed. We have sent the details to your email — please check your inbox (and spam folder) for your confirmation and QR code for check-in.",
  },
  "waitlist-complete": {
    title: "You’re on the waitlist",
    description:
      "Your registration has been saved. Redirecting you to your waitlist confirmation…",
  },
};

type Props = {
  state: RegistrationFlowOverlayState | null;
};

export function RegistrationFlowOverlay({ state }: Props) {
  if (!state) return null;

  const { title, description } = COPY[state.phase];
  const isSuccess =
    state.phase === "payment-success" || state.phase === "waitlist-complete";
  const showSpinner = !isSuccess;

  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="z-[60] gap-6 p-8 text-center sm:max-w-md"
      >
        <DialogHeader className="items-center gap-4 text-center sm:text-center">
          <div
            className={cn(
              "flex size-14 items-center justify-center rounded-full",
              isSuccess ? "bg-primary/10 text-primary" : "bg-muted"
            )}
          >
            {showSpinner ? (
              <Loader2 className="size-8 animate-spin text-primary" />
            ) : state.phase === "payment-success" ? (
              <CheckCircle2 className="size-8 text-primary" />
            ) : (
              <Mail className="size-8 text-primary" />
            )}
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            {description}
          </DialogDescription>
          {state.phase === "payment-success" && state.email ? (
            <p className="text-sm text-muted-foreground">
              Sent to{" "}
              <span className="font-medium text-foreground">{state.email}</span>
            </p>
          ) : null}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { delay };
