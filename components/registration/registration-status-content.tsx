"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { Button } from "@/components/ui/button";
import { RegistrationStatusCard } from "@/components/registration/registration-status-card";
import { RegistrationPendingPayment } from "@/components/registration/registration-pending-payment";
import { api } from "@/convex/_generated/api";
import { mockEvent } from "@/lib/mock-event";
import type { PendingRegistration } from "@/lib/registration-storage";

type Props = {
  confirmationCode: string;
};

export function RegistrationStatusContent({ confirmationCode }: Props) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const lookup = useQuery(
    api.registrations.getByConfirmationCode,
    convexUrl ? { confirmationCode } : "skip"
  );

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

  if (lookup === undefined && convexUrl) {
    return (
      <p className="mt-8 text-sm text-muted-foreground">Loading registration…</p>
    );
  }

  if (!lookup) {
    return (
      <div className="mt-8 space-y-4">
        <p className="text-sm text-destructive">
          No registration found for this reference code.
        </p>
        <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
          Back to home
        </Button>
      </div>
    );
  }

  const { registration, event, ticketType, waitlistPosition } = lookup;

  return (
    <div className="mt-10 space-y-6 text-left">
      <RegistrationStatusCard
        attendeeName={registration.fullName}
        passName={ticketType.name}
        confirmationCode={registration.confirmationCode}
        status={registration.status}
        eventTitleLine2={event.titleLine2}
        edition={event.edition}
        dateShort={event.dateShort}
        venue={event.venue}
        city={event.city}
        waitlistPosition={waitlistPosition}
      />

      {pendingCheckout ? (
        <RegistrationPendingPayment registration={pendingCheckout} />
      ) : null}

      <Button
        variant="outline"
        className="w-full"
        nativeButton={false}
        render={<Link href="/" />}
      >
        Back to conference home
      </Button>
    </div>
  );
}
