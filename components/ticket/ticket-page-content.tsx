"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { TicketCard } from "@/components/ticket/ticket-card";
import { api } from "@/convex/_generated/api";
import { mockEvent } from "@/lib/mock-event";

type Props = {
  token: string;
};

export function TicketPageContent({ token }: Props) {
  const isDemo = token === "demo";
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const lookup = useQuery(
    api.registrations.getByConfirmationCode,
    !isDemo && convexUrl ? { confirmationCode: token } : "skip"
  );

  if (isDemo) {
    return (
      <>
        <p className="mt-2 text-xs text-amber-600">
          Demo ticket — payment integration coming soon.
        </p>
        <div className="mt-10">
          <TicketCard
            attendeeName="Demo Delegate"
            tierName="Standard delegate"
            confirmationCode="EVT-NPSC-2026-DEMO"
            variant="confirmed"
            eventTitleLine2={mockEvent.titleLine2}
            edition={mockEvent.edition}
            dateShort={mockEvent.dateShort}
            venue={mockEvent.venue}
            city={mockEvent.city}
          />
        </div>
      </>
    );
  }

  if (!convexUrl) {
    return (
      <p className="mt-4 text-sm text-muted-foreground">
        Convex is not configured — cannot load this ticket.
      </p>
    );
  }

  if (lookup === undefined) {
    return (
      <p className="mt-4 text-sm text-muted-foreground">Loading ticket…</p>
    );
  }

  if (lookup === null) {
    return (
      <div className="mt-8 space-y-4 text-center">
        <p className="text-sm text-destructive">
          No registration found for this confirmation code.
        </p>
        <Link href="/">
          <Button variant="outline">Back to home</Button>
        </Link>
      </div>
    );
  }

  const { registration, event, ticketType, waitlistPosition } = lookup;
  const isWaitlisted = registration.status === "waitlisted";

  return (
    <div className="mt-10">
      <TicketCard
        attendeeName={registration.fullName}
        tierName={ticketType.name}
        confirmationCode={registration.confirmationCode}
        variant={isWaitlisted ? "waitlisted" : "confirmed"}
        waitlistPosition={waitlistPosition}
        eventTitleLine2={event.titleLine2}
        edition={event.edition}
        dateShort={event.dateShort}
        venue={event.venue}
        city={event.city}
      />
    </div>
  );
}
