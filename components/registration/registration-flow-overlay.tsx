"use client";

import { CheckCircle2, ClipboardList, Loader2 } from "lucide-react";
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
  confirmationCode?: string;
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
    title: "Registration saved",
    description:
      "Redirecting you to Mobile Money payment details and your reference code.",
  },
  "processing-payment": {
    title: "Saving registration",
    description: "Please wait…",
  },
  "payment-success": {
    title: "Registration saved",
    description:
      "Send your pass fee via Mobile Money using the details on the next screen. GIPS will confirm after verification.",
  },
  "waitlist-complete": {
    title: "You’re on the waitlist",
    description:
      "Your registration has been saved. Redirecting you to your registration status page…",
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
              <ClipboardList className="size-8 text-primary" />
            )}
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            {description}
          </DialogDescription>
          {state.phase === "payment-success" && state.confirmationCode ? (
            <p className="text-sm text-muted-foreground">
              Reference{" "}
              <span className="font-mono font-medium text-foreground">
                {state.confirmationCode}
              </span>
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
