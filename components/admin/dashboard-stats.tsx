"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format-price";

export type DashboardSummary = {
  eventCount: number;
  publishedEventCount: number;
  ticketTypeCount: number;
  totalCapacity: number;
  totalSold: number;
  staffCount: number;
  totalRegistrations: number;
  pending: number;
  confirmed: number;
  waitlisted: number;
  cancelled: number;
  certificatesIssued: number;
  paymentCount: number;
  totalRevenue: number;
  primaryCurrency: string;
};

type Props = {
  summary: DashboardSummary;
  showRegistrations?: boolean;
  showFinance?: boolean;
};

export function DashboardStats({
  summary,
  showRegistrations = false,
  showFinance = false,
}: Props) {
  const cards: { label: string; value: string | number }[] = [
    { label: "Events", value: summary.eventCount },
    { label: "Published", value: summary.publishedEventCount },
    { label: "Pass types", value: summary.ticketTypeCount },
    { label: "Passes sold", value: summary.totalSold },
    { label: "Total capacity", value: summary.totalCapacity },
    { label: "Staff accounts", value: summary.staffCount },
  ];

  if (showRegistrations) {
    cards.push(
      { label: "Registrations", value: summary.totalRegistrations },
      { label: "Confirmed", value: summary.confirmed },
      { label: "Pending payment", value: summary.pending },
      { label: "Certificates issued", value: summary.certificatesIssued }
    );
  }

  if (showFinance) {
    cards.push(
      {
        label: "Revenue collected",
        value: formatPrice(summary.totalRevenue, summary.primaryCurrency),
      },
      { label: "Payments", value: summary.paymentCount }
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
