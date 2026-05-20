"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/format-price";
import type { PublicEventBundle, TicketTypeOption } from "@/lib/event/types";
import { cn } from "@/lib/utils";

const KIND_LABELS: Record<string, string> = {
  participant: "Participant",
  vip: "VIP",
  speaker: "Speaker",
  sponsor: "Sponsor",
  exhibitor: "Exhibitor",
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 p-6 sm:max-w-2xl sm:p-8">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl sm:text-2xl">
            Choose your registration type
          </DialogTitle>
          <DialogDescription>
            {event.titleLine2} · {event.dateShort}
          </DialogDescription>
        </DialogHeader>

        {!bundle.isLive ? (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-900 dark:text-amber-200">
            Preview mode — run database setup at{" "}
            <a href="/admin/setup" className="font-medium underline">
              /admin/setup
            </a>{" "}
            to save registrations to the server.
          </p>
        ) : null}

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
      </DialogContent>
    </Dialog>
  );
}
