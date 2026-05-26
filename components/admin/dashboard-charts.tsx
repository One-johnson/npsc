"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format-price";

const STATUS_COLORS: Record<string, string> = {
  confirmed: "hsl(145 45% 32%)",
  pending: "hsl(38 92% 50%)",
  waitlisted: "hsl(220 10% 55%)",
  cancelled: "hsl(0 72% 50%)",
};

const CHART_COLORS = [
  "hsl(145 45% 32%)",
  "hsl(38 70% 45%)",
  "hsl(25 75% 48%)",
  "hsl(220 12% 42%)",
  "hsl(200 60% 45%)",
  "hsl(280 35% 48%)",
];

type ReportingData = {
  updatedAt: number;
  summary: {
    primaryCurrency: string;
    totalRevenue: number;
    paymentCount: number;
  };
  registrationsByStatus: {
    status: string;
    label: string;
    count: number;
  }[];
  registrationsOverTime: {
    label: string;
    total: number;
    confirmed: number;
    pending: number;
  }[];
  revenueOverTime: { label: string; amount: number }[];
  paymentsByMethod: { label: string; count: number; amount: number }[];
  passTypeSales: { name: string; soldCount: number; capacity: number }[];
  eventCapacity: {
    title: string;
    edition: string;
    registeredCount: number;
    capacity: number;
  }[];
};

type Props = {
  data: ReportingData;
  showFinance: boolean;
  showRegistrations: boolean;
};

function ChartTooltipCard({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      {label ? <p className="mb-1 font-medium text-foreground">{label}</p> : null}
      <ul className="space-y-0.5 text-muted-foreground">
        {payload.map((entry) => (
          <li key={entry.name} className="flex items-center gap-2">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>
              {entry.name}: <strong className="text-foreground">{entry.value}</strong>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DashboardCharts({
  data,
  showFinance,
  showRegistrations,
}: Props) {
  const hasRegActivity = data.registrationsOverTime.some(
    (d) => d.total > 0 || d.confirmed > 0 || d.pending > 0
  );
  const hasRevenue = data.revenueOverTime.some((d) => d.amount > 0);

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">
        Live data — updates automatically when registrations or payments change.
        Last refresh:{" "}
        {new Date(data.updatedAt).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </p>

      {showRegistrations ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Registrations over time</CardTitle>
              <CardDescription>Last 30 days — new sign-ups per day</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              {hasRegActivity ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.registrationsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      interval="preserveStartEnd"
                      minTickGap={24}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={32} />
                    <Tooltip content={<ChartTooltipCard />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="confirmed"
                      name="Confirmed"
                      stackId="1"
                      stroke={STATUS_COLORS.confirmed}
                      fill={STATUS_COLORS.confirmed}
                      fillOpacity={0.35}
                    />
                    <Area
                      type="monotone"
                      dataKey="pending"
                      name="Pending"
                      stackId="1"
                      stroke={STATUS_COLORS.pending}
                      fill={STATUS_COLORS.pending}
                      fillOpacity={0.35}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      name="All new"
                      stroke="hsl(220 12% 42%)"
                      fill="none"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No registrations in the last 30 days." />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Registration status</CardTitle>
              <CardDescription>Current breakdown across all events</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              {data.registrationsByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.registrationsByStatus}
                      dataKey="count"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={56}
                      outerRadius={88}
                      paddingAngle={2}
                    >
                      {data.registrationsByStatus.map((entry) => (
                        <Cell
                          key={entry.status}
                          fill={
                            STATUS_COLORS[entry.status] ?? CHART_COLORS[0]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipCard />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No registrations yet." />
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {showFinance ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payment revenue</CardTitle>
              <CardDescription>
                Completed payments — last 30 days (
                {data.summary.primaryCurrency})
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              {hasRevenue ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.revenueOverTime}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      interval="preserveStartEnd"
                      minTickGap={24}
                    />
                    <YAxis tick={{ fontSize: 11 }} width={48} />
                    <Tooltip
                      content={({ active, payload, label }) =>
                        active && payload?.[0] ? (
                          <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
                            <p className="font-medium">{label}</p>
                            <p className="text-muted-foreground">
                              {formatPrice(
                                Number(payload[0].value),
                                data.summary.primaryCurrency
                              )}
                            </p>
                          </div>
                        ) : null
                      }
                    />
                    <Bar
                      dataKey="amount"
                      name="Revenue"
                      fill="hsl(145 45% 32%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No completed payments in the last 30 days." />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Payments by method</CardTitle>
              <CardDescription>All completed payments</CardDescription>
            </CardHeader>
            <CardContent className="h-[280px]">
              {data.paymentsByMethod.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.paymentsByMethod} layout="vertical" margin={{ left: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="label"
                      tick={{ fontSize: 11 }}
                      width={88}
                    />
                    <Tooltip content={<ChartTooltipCard />} />
                    <Bar dataKey="count" name="Payments" radius={[0, 4, 4, 0]}>
                      {data.paymentsByMethod.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No payments recorded yet." />
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {showRegistrations ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Capacity by event</CardTitle>
              <CardDescription>Registered vs total capacity</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {data.eventCapacity.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.eventCapacity.slice(0, 6)}
                    margin={{ bottom: 48 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                    <XAxis
                      dataKey="edition"
                      tick={{ fontSize: 10 }}
                      angle={-20}
                      textAnchor="end"
                      height={56}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip content={<ChartTooltipCard />} />
                    <Legend />
                    <Bar
                      dataKey="registeredCount"
                      name="Registered"
                      fill="hsl(145 45% 32%)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="capacity"
                      name="Capacity"
                      fill="hsl(220 12% 75%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No events configured." />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Passes sold</CardTitle>
              <CardDescription>Top pass types by sold count</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {data.passTypeSales.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.passTypeSales}
                    layout="vertical"
                    margin={{ left: 8, right: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      width={120}
                    />
                    <Tooltip content={<ChartTooltipCard />} />
                    <Bar dataKey="soldCount" name="Sold" radius={[0, 4, 4, 0]}>
                      {data.passTypeSales.map((_, i) => (
                        <Cell
                          key={i}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No pass sales yet." />
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
