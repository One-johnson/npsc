"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStaffSession } from "@/components/auth/session-provider";
import { formatPrice } from "@/lib/mock-event";
import type { Doc } from "@/convex/_generated/dataModel";

export function TicketTypesPanel({ eventId }: { eventId: Id<"events"> }) {
  const { sessionToken, user } = useStaffSession();
  const tickets = useQuery(
    api.ticketTypes.listByEvent,
    sessionToken ? { sessionToken, eventId } : "skip"
  );
  const updateTicket = useMutation(api.ticketTypes.update);

  if (tickets === undefined) {
    return <p className="text-sm text-muted-foreground">Loading ticket types…</p>;
  }

  const canEdit = user?.role === "admin";

  async function toggleActive(
    ticketTypeId: Id<"ticketTypes">,
    isActive: boolean
  ) {
    if (!sessionToken || !canEdit) return;
    await updateTicket({
      sessionToken,
      ticketTypeId,
      isActive: !isActive,
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Ticket types</h2>
        <p className="text-sm text-muted-foreground">
          Participant, VIP, Speaker, Sponsor, Exhibitor, Media, and more.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Kind</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Sold / cap</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {canEdit ? <th className="px-4 py-3 font-medium" /> : null}
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket: Doc<"ticketTypes">) => (
              <tr
                key={ticket._id}
                className="border-b border-border/60 last:border-0"
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{ticket.name}</p>
                  <p className="text-xs text-muted-foreground">{ticket.slug}</p>
                </td>
                <td className="px-4 py-3 capitalize">{ticket.kind}</td>
                <td className="px-4 py-3">
                  {formatPrice(ticket.price, ticket.currency)}
                </td>
                <td className="px-4 py-3">
                  {ticket.soldCount} / {ticket.capacity}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={ticket.isActive ? "default" : "secondary"}>
                    {ticket.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
                {canEdit ? (
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        void toggleActive(ticket._id, ticket.isActive)
                      }
                    >
                      {ticket.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
