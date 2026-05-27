"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RegistrationModal,
  RegistrationModalBackButton,
  RegistrationModalBody,
  RegistrationModalDescription,
  RegistrationModalHeader,
  RegistrationModalTitle,
} from "@/components/registration/registration-modal";
import { formatPrice } from "@/lib/format-price";
import type { PublicEventBundle, TicketTypeOption } from "@/lib/event/types";
import { cn } from "@/lib/utils";

const KIND_LABELS: Record<string, string> = {
  participant: "Participant",
  vip: "International",
  speaker: "Speaker",
  sponsor: "Sponsor",
  exhibitor: "Exhibition Package",
  student: "Student",
  media: "Media",
};

type Props = {
  bundle: PublicEventBundle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (ticket: TicketTypeOption) => void;
};

export function TicketTypeDialog({
  bundle,
  open,
  onOpenChange,
  onSelect,
}: Props) {
  const { event, ticketTypes } = bundle;
  const eventFull = event.registeredCount >= event.capacity;

  return (
    <RegistrationModal
      open={open}
      onOpenChange={onOpenChange}
      className="gap-4 p-6 sm:max-w-2xl sm:p-8"
    >
      <RegistrationModalBackButton
        label="Close"
        onBack={() => onOpenChange(false)}
      />
      <RegistrationModalHeader className="text-left">
        <RegistrationModalTitle className="text-xl sm:text-2xl">
          Choose your registration type
        </RegistrationModalTitle>
        <RegistrationModalDescription>
          {event.titleLine2} · {event.dateShort}
        </RegistrationModalDescription>
      </RegistrationModalHeader>

      <RegistrationModalBody className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {ticketTypes.map((ticket) => {
            const spotsLeft = ticket.capacity - ticket.soldCount;
            const tierSoldOut = spotsLeft <= 0;
            const waitlistOnly = eventFull || tierSoldOut;

            return (
              <button
                key={ticket.id}
                type="button"
                onClick={() => onSelect(ticket)}
                className={cn(
                  "flex flex-col rounded-xl border p-4 text-left transition-colors",
                  waitlistOnly
                    ? "border-amber-500/40 bg-amber-500/5 hover:border-amber-500/60 hover:bg-amber-500/10"
                    : "border-border hover:border-primary hover:bg-primary/5"
                )}
              >
                <div className="flex w-full items-start justify-between gap-2">
                  <span className="font-semibold">
                    {KIND_LABELS[ticket.kind] ?? ticket.name}
                  </span>
                  <Badge variant={waitlistOnly ? "outline" : "secondary"}>
                    {waitlistOnly
                      ? eventFull
                        ? "Event full"
                        : "Waitlist"
                      : `${spotsLeft} left`}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {ticket.description}
                </p>
                <p className="mt-3 text-lg font-bold text-primary">
                  {ticket.price > 0
                    ? formatPrice(ticket.price, ticket.currency)
                    : "Complimentary"}
                </p>
                {waitlistOnly ? (
                  <span className="mt-2 text-xs font-medium text-amber-800 dark:text-amber-200">
                    Tap to join the waitlist
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
      </RegistrationModalBody>
    </RegistrationModal>
  );
}
