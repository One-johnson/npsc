"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format-price";

type PaymentRow = {
  _id: string;
  attendeeName: string;
  attendeeEmail: string;
  confirmationCode: string;
  ticketTypeName: string;
  amount: number;
  currency: string;
  method: string;
  provider: string;
  status: string;
  externalReference?: string;
  paidAt: number;
  recordedByName?: string;
};

type Props = {
  payments: PaymentRow[] | undefined;
  pendingCount: number;
};

const PROVIDER_LABELS: Record<string, string> = {
  mock: "Mock checkout",
  manual: "Manual",
  hubtel: "Hubtel",
};

export function PaymentsTable({ payments, pendingCount }: Props) {
  if (payments === undefined) {
    return <p className="text-sm text-muted-foreground">Loading payments…</p>;
  }

  if (payments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {pendingCount > 0
          ? `${pendingCount} registration(s) await payment — use Record manual payment.`
          : "No payments recorded for this edition yet."}
      </p>
    );
  }

  return (
    <div className="overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Attendee</TableHead>
            <TableHead>Pass</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Confirmation</TableHead>
            <TableHead>Paid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p._id}>
              <TableCell>
                <p className="font-medium">{p.attendeeName}</p>
                <p className="text-xs text-muted-foreground">{p.attendeeEmail}</p>
              </TableCell>
              <TableCell>{p.ticketTypeName}</TableCell>
              <TableCell className="font-medium">
                {formatPrice(p.amount, p.currency)}
              </TableCell>
              <TableCell className="capitalize">{p.method}</TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {PROVIDER_LABELS[p.provider] ?? p.provider}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">
                {p.confirmationCode}
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {new Date(p.paidAt).toLocaleString()}
                {p.recordedByName ? (
                  <span className="block text-xs">by {p.recordedByName}</span>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
