"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { DashboardReportingSkeleton } from "@/components/admin/dashboard-reporting-skeleton";
import { useStaffSession } from "@/components/auth/session-provider";

export function DashboardReporting() {
  const { sessionToken, user } = useStaffSession();
  const report = useQuery(
    api.dashboard.reporting,
    sessionToken ? { sessionToken } : "skip"
  );

  const showRegistrations =
    user?.role === "admin" || user?.role === "finance";
  const showFinance = user?.role === "admin" || user?.role === "finance";

  if (report === undefined) {
    return <DashboardReportingSkeleton />;
  }

  return (
    <div className="space-y-8">
      <DashboardStats
        summary={report.summary}
        showRegistrations={showRegistrations}
        showFinance={showFinance}
      />

      {showRegistrations || showFinance ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Live reporting</h2>
            <p className="text-sm text-muted-foreground">
              Charts update automatically when registrations or payments change.
            </p>
          </div>
          <DashboardCharts
            data={report}
            showFinance={showFinance}
            showRegistrations={showRegistrations}
          />
        </section>
      ) : null}
    </div>
  );
}
