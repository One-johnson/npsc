"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { TicketCard } from "@/components/ticket/ticket-card";
import { TicketPendingPayment } from "@/components/ticket/ticket-pending-payment";
import { api } from "@/convex/_generated/api";
import { useConferenceEvent } from "@/hooks/use-conference-event";
import { mockEvent } from "@/lib/mock-event";
import type { PendingRegistration } from "@/lib/registration-storage";

type Props = {
  token: string;
  openPayment?: boolean;
};

export function TicketPageContent({ token, openPayment = false }: Props) {
  const isDemo = token === "demo";
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const lookup = useQuery(
    api.registrations.getByConfirmationCode,
    !isDemo && convexUrl ? { confirmationCode: token } : "skip"
  );

  const eventSlug = lookup?.event.slug ?? mockEvent.slug;
  const { bundle } = useConferenceEvent(eventSlug);

  const pendingCheckout = useMemo((): PendingRegistration | null => {
    if (!lookup || lookup.registration.status !== "pending") return null;
    const { registration, event, ticketType } = lookup;
    return {
      ticketTypeId: registration.ticketTypeId,
      fullName: registration.fullName,
      email: registration.email,
      phone: registration.phone,
      organization: registration.organization ?? "",
      position: registration.position ?? "",
      eventSlug: event.slug,
      ticketTypeName: ticketType.name,
      ticketKind: registration.ticketKind,
      price: ticketType.price,
      currency: ticketType.currency,
      isLive: true,
      createdAt: new Date(registration.createdAt).toISOString(),
      confirmationCode: registration.confirmationCode,
    };
  }, [lookup]);

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

  const { registration, event, ticketType, waitlistPosition, qrPayload } =
    lookup;
  const isWaitlisted = registration.status === "waitlisted";
  const isPending = registration.status === "pending";

  const variant = isWaitlisted
    ? "waitlisted"
    : isPending
      ? "pending"
      : "confirmed";

  return (
    <div className="mt-10">
      <TicketCard
        attendeeName={registration.fullName}
        tierName={ticketType.name}
        confirmationCode={registration.confirmationCode}
        variant={variant}
        waitlistPosition={waitlistPosition}
        eventTitleLine2={event.titleLine2}
        edition={event.edition}
        dateShort={event.dateShort}
        venue={event.venue}
        city={event.city}
        qrPayload={qrPayload}
      />
      {isPending && pendingCheckout ? (
        <TicketPendingPayment
          bundle={bundle}
          registration={pendingCheckout}
          autoOpen={openPayment}
        />
      ) : null}
    </div>
  );
}
