"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStaffSession } from "@/components/auth/session-provider";
import { TicketTypesPanel } from "@/components/admin/ticket-types-panel";
import { EventRegistrationsPanel } from "@/components/admin/event-registrations-panel";

export function EventDetailPanel({ eventId }: { eventId: Id<"events"> }) {
  const { sessionToken, user } = useStaffSession();
  const event = useQuery(
    api.events.getById,
    sessionToken ? { sessionToken, eventId } : "skip"
  );
  const updateEvent = useMutation(api.events.update);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (event === undefined) {
    return <p className="text-sm text-muted-foreground">Loading event…</p>;
  }
  if (event === null) {
    return <p className="text-sm text-destructive">Event not found.</p>;
  }

  const canEdit = user?.role === "admin";

  async function togglePublished() {
    if (!sessionToken || !canEdit || !event) return;
    const ev = event;
    setSaving(true);
    setMessage(null);
    try {
      await updateEvent({
        sessionToken,
        eventId,
        isPublished: !ev.isPublished,
        organizers: ev.organizers,
        agenda: ev.agenda,
        features: ev.features,
        audiences: ev.audiences,
        steps: ev.steps,
        faqs: ev.faqs,
        partners: ev.partners,
      });
      setMessage(ev.isPublished ? "Unpublished" : "Published");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">{event.titleLine2}</h1>
            <Badge variant={event.isPublished ? "default" : "secondary"}>
              {event.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            /events/{event.slug} · {event.date}
          </p>
        </div>
        {canEdit ? (
          <Button
            variant="outline"
            disabled={saving}
            onClick={() => void togglePublished()}
          >
            {event.isPublished ? "Unpublish" : "Publish"}
          </Button>
        ) : null}
      </div>

      {message ? (
        <p className="text-sm text-muted-foreground">{message}</p>
      ) : null}

      <div className="grid gap-6 rounded-xl border border-border bg-card p-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Edition</Label>
          <Input value={event.edition} readOnly />
        </div>
        <div className="space-y-2">
          <Label>Venue</Label>
          <Input value={`${event.venue}, ${event.city}`} readOnly />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Tagline</Label>
          <Input value={event.tagline} readOnly />
        </div>
        <div className="space-y-2">
          <Label>Capacity</Label>
          <Input value={String(event.capacity)} readOnly />
        </div>
        <div className="space-y-2">
          <Label>Registered (display)</Label>
          <Input value={String(event.registeredCount)} readOnly />
        </div>
      </div>

      <TicketTypesPanel eventId={eventId} />

      <EventRegistrationsPanel eventId={eventId} />
    </div>
  );
}


