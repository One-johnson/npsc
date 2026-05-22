"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStaffSession } from "@/components/auth/session-provider";

export function DashboardStats() {
  const { sessionToken } = useStaffSession();
  const stats = useQuery(
    api.events.dashboardStats,
    sessionToken ? { sessionToken } : "skip"
  );

  if (stats === undefined) {
    return <p className="text-sm text-muted-foreground">Loading statistics…</p>;
  }

  const cards = [
    { label: "Events", value: stats.eventCount },
    { label: "Published", value: stats.publishedEventCount },
    { label: "Pass types", value: stats.ticketTypeCount },
    { label: "Passes sold", value: stats.totalSold },
    { label: "Total capacity", value: stats.totalCapacity },
    { label: "Staff accounts", value: stats.staffCount },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
