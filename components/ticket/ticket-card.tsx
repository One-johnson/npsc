import { CheckCircle2, Clock, CreditCard } from "lucide-react";
import { TicketQrCode } from "@/components/ticket/ticket-qr-code";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TicketCardProps = {
  attendeeName?: string;
  tierName?: string;
  confirmationCode?: string;
  variant?: "confirmed" | "pending" | "waitlisted";
  waitlistPosition?: number;
  eventTitleLine2?: string;
  edition?: string;
  dateShort?: string;
  venue?: string;
  city?: string;
  /** Signed payload for check-in QR (confirmed tickets only). */
  qrPayload?: string;
};

export function TicketCard({
  attendeeName = "Delegate Name",
  tierName = "Standard delegate",
  confirmationCode = "EVT-NPSC-2026-DEMO",
  variant = "confirmed",
  waitlistPosition,
  eventTitleLine2 = "Conference",
  edition = "NPSC",
  dateShort = "",
  venue = "",
  city = "",
  qrPayload,
}: TicketCardProps) {
  const isWaitlisted = variant === "waitlisted";
  const isPending = variant === "pending";

  return (
    <Card
      className={`mx-auto max-w-md shadow-lg ring-2 ${
        isWaitlisted
          ? "ring-amber-500/30"
          : isPending
            ? "ring-sky-500/30"
            : "ring-primary/20"
      }`}
    >
      <CardHeader
        className={
          isWaitlisted
            ? "bg-amber-500/10"
            : isPending
              ? "bg-sky-500/10"
              : "bg-primary/5"
        }
      >
        <div
          className={`flex items-center gap-2 ${
            isWaitlisted
              ? "text-amber-700 dark:text-amber-400"
              : isPending
                ? "text-sky-700 dark:text-sky-400"
                : "text-primary"
          }`}
        >
          {isWaitlisted ? (
            <Clock className="size-5" />
          ) : isPending ? (
            <CreditCard className="size-5" />
          ) : (
            <CheckCircle2 className="size-5" />
          )}
          <span className="text-sm font-medium">
            {isWaitlisted
              ? "On the waitlist"
              : isPending
                ? "Awaiting payment"
                : "Registration confirmed"}
          </span>
        </div>
        <CardTitle className="text-xl">
          {isWaitlisted
            ? "You’re on the waitlist"
            : isPending
              ? "Complete payment to confirm"
              : "You’re registered!"}
        </CardTitle>
        <CardDescription>{eventTitleLine2}</CardDescription>
        {isWaitlisted && waitlistPosition !== undefined ? (
          <p className="text-sm text-muted-foreground">
            Your position: <span className="font-semibold">{waitlistPosition}</span>
            {" — "}we will email you if a seat opens.
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{edition}</Badge>
          {dateShort ? (
            <Badge variant="outline">{dateShort}</Badge>
          ) : null}
        </div>
        <dl className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Attendee</dt>
            <dd className="font-medium">{attendeeName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Pass</dt>
            <dd className="font-medium">{tierName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Venue</dt>
            <dd className="text-right font-medium">
              {venue}
              {venue && city ? ", " : ""}
              {city}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Confirmation</dt>
            <dd className="font-mono text-xs">{confirmationCode}</dd>
          </div>
        </dl>
        {isWaitlisted ? (
          <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-center text-xs text-muted-foreground">
            No check-in QR yet — complete payment when you are promoted from the
            waitlist.
          </p>
        ) : isPending ? (
          <p className="rounded-lg border border-sky-500/20 bg-sky-500/5 px-3 py-2 text-center text-xs text-muted-foreground">
            Your seat is reserved. Complete payment below to confirm your
            registration and receive your check-in QR code.
          </p>
        ) : qrPayload ? (
          <>
            <div className="mx-auto flex justify-center rounded-xl border border-primary/20 bg-white p-3">
              <TicketQrCode value={qrPayload} size={200} />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Present this QR code at check-in
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
