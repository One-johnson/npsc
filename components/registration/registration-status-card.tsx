import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  attendeeName: string;
  passName: string;
  confirmationCode: string;
  status: "pending" | "confirmed" | "waitlisted" | "cancelled";
  eventTitleLine2: string;
  edition: string;
  dateShort: string;
  venue: string;
  city: string;
  waitlistPosition?: number;
};

const STATUS_LABELS: Record<Props["status"], string> = {
  pending: "Awaiting payment",
  confirmed: "Confirmed",
  waitlisted: "On waitlist",
  cancelled: "Cancelled",
};

export function RegistrationStatusCard({
  attendeeName,
  passName,
  confirmationCode,
  status,
  eventTitleLine2,
  edition,
  dateShort,
  venue,
  city,
  waitlistPosition,
}: Props) {
  return (
    <Card className="text-left ring-2 ring-primary/15">
      <CardHeader className="pb-3">
        <Badge
          variant={
            status === "confirmed"
              ? "default"
              : status === "waitlisted"
                ? "outline"
                : "secondary"
          }
        >
          {STATUS_LABELS[status]}
        </Badge>
        <CardTitle className="text-lg">{attendeeName}</CardTitle>
        <CardDescription>
          {eventTitleLine2} · {edition}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Pass type" value={passName} />
        <Row label="Reference" value={confirmationCode} mono />
        <Row
          label="When"
          value={[dateShort, venue, city].filter(Boolean).join(" · ")}
        />
        {status === "waitlisted" && waitlistPosition !== undefined ? (
          <p className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-amber-950 dark:text-amber-100">
            Waitlist position: <strong>{waitlistPosition}</strong>
          </p>
        ) : null}
        {status === "pending" ? (
          <p className="text-muted-foreground">
            Send your pass fee via Mobile Money or bank transfer using the
            payment details below.
            Include this reference in your payment memo. GIPS will confirm your
            registration after verification.
          </p>
        ) : null}
        {status === "confirmed" ? (
          <p className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-muted-foreground">
            Your registration is confirmed. Certificates of attendance are issued
            by GIPS after the conference and distributed through official
            channels — not via this page.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-right font-medium", mono && "font-mono text-xs")}>
        {value}
      </span>
    </div>
  );
}
