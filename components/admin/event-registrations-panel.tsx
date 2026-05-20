"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStaffSession } from "@/components/auth/session-provider";

type Props = { eventId: Id<"events"> };

export function EventRegistrationsPanel({ eventId }: Props) {
  const { sessionToken, user } = useStaffSession();
  const rows = useQuery(
    api.registrations.listByEventAdmin,
    sessionToken ? { sessionToken, eventId } : "skip"
  );
  const promote = useMutation(api.registrations.promoteWaitlistedRegistration);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const canPromote = user?.role === "admin";

  if (rows === undefined) {
    return <p className="text-sm text-muted-foreground">Loading registrations…</p>;
  }

  async function onPromote(registrationId: Id<"registrations">) {
    if (!sessionToken) return;
    setBusyId(registrationId);
    setMessage(null);
    try {
      await promote({ sessionToken, registrationId });
      setMessage("Registration promoted from waitlist.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Promote failed");
    } finally {
      setBusyId(null);
    }
  }

  const waitlisted = rows.filter((r) => r.status === "waitlisted").length;
  const active = rows.filter(
    (r) => r.status === "pending" || r.status === "confirmed"
  ).length;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Registrations</h2>
          <p className="text-sm text-muted-foreground">
            {active} active · {waitlisted} on waitlist
          </p>
        </div>
      </div>
      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No registrations yet.</p>
      ) : (
        <div className="max-h-[420px] overflow-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium">{r.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{r.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        r.status === "waitlisted"
                          ? "outline"
                          : r.status === "cancelled"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === "waitlisted" && canPromote ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === r._id}
                        onClick={() => void onPromote(r._id)}
                      >
                        {busyId === r._id ? "…" : "Promote"}
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
