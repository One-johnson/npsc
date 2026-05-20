"use client";

import Link from "next/link";
import { Copy, ExternalLink, Pencil } from "lucide-react";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type Props = {
  event: Doc<"events"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canManage: boolean;
  onEdit: (event: Doc<"events">) => void;
  onDuplicate?: (event: Doc<"events">) => void;
};

function heroSrc(heroImage: string) {
  if (heroImage.startsWith("http") || heroImage.startsWith("blob:")) {
    return heroImage;
  }
  return heroImage;
}

export function EventDetailSheet({
  event,
  open,
  onOpenChange,
  canManage,
  onEdit,
  onDuplicate,
}: Props) {
  if (!event) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg" />
      </Sheet>
    );
  }

  const eventId = event._id as Id<"events">;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{event.titleLine2}</SheetTitle>
          <SheetDescription>
            {event.edition} · {event.date}
          </SheetDescription>
          <Badge
            variant={event.isPublished ? "default" : "secondary"}
            className="w-fit"
          >
            {event.isPublished ? "Published" : "Draft"}
          </Badge>
        </SheetHeader>

        <div className="relative mx-4 aspect-[16/9] overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroSrc(event.heroImage)}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <dl className="grid gap-3 px-4 text-sm">
          <DetailRow label="Slug" value={event.slug} mono />
          <DetailRow label="Subtitle" value={event.subtitle} />
          <DetailRow label="Venue" value={`${event.venue}, ${event.city}, ${event.country}`} />
          <DetailRow label="Time" value={event.time} />
          <DetailRow label="Capacity" value={String(event.capacity)} />
          <DetailRow label="Registered" value={String(event.registeredCount)} />
          <DetailRow label="Website" value={event.website} />
          <div>
            <dt className="text-muted-foreground">About</dt>
            <dd className="mt-1 leading-relaxed">{event.about}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Tagline</dt>
            <dd className="mt-1 leading-relaxed">{event.tagline}</dd>
          </div>
        </dl>

        <SheetFooter className="flex-row flex-wrap gap-2 sm:justify-start">
          <Link href={`/events/${event.slug}`} target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 size-4" />
              Public page
            </Button>
          </Link>
          <Link href={`/admin/events/${eventId}`}>
            <Button variant="outline" size="sm">
              Ticket types & registrations
            </Button>
          </Link>
          {canManage ? (
            <>
              {onDuplicate ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDuplicate(event)}
                >
                  <Copy className="mr-2 size-4" />
                  Duplicate for next year
                </Button>
              ) : null}
              <Button size="sm" onClick={() => onEdit(event)}>
                <Pencil className="mr-2 size-4" />
                Edit event
              </Button>
            </>
          ) : null}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({
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
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className={mono ? "font-mono text-xs text-right" : "text-right"}>
        {value}
      </dd>
    </div>
  );
}
