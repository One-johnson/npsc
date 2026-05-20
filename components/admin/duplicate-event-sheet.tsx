"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { bumpYearInLabel, suggestNextYearSlug } from "@/lib/event/slug-year";

type Props = {
  source: Doc<"events"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionToken: string;
  onDuplicated?: () => void;
};

export function DuplicateEventSheet({
  source,
  open,
  onOpenChange,
  sessionToken,
  onDuplicated,
}: Props) {
  const router = useRouter();
  const duplicateEvent = useMutation(api.events.duplicate);

  const [newSlug, setNewSlug] = useState("");
  const [edition, setEdition] = useState("");
  const [date, setDate] = useState("");
  const [dateShort, setDateShort] = useState("");
  const [publishNew, setPublishNew] = useState(false);
  const [unpublishSource, setUnpublishSource] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !source) return;
    setError(null);
    setNewSlug(suggestNextYearSlug(source.slug));
    setEdition(source.edition);
    setDate(bumpYearInLabel(source.date));
    setDateShort(bumpYearInLabel(source.dateShort));
    setPublishNew(false);
    setUnpublishSource(source.isPublished);
  }, [open, source]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!source) return;
    setError(null);
    setSubmitting(true);
    try {
      const result = await duplicateEvent({
        sessionToken,
        sourceEventId: source._id,
        newSlug,
        edition,
        date,
        dateShort,
        isPublished: publishNew,
        unpublishSource: unpublishSource,
      });
      onDuplicated?.();
      onOpenChange(false);
      router.push(`/admin/events/${result.eventId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Duplicate failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!source) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="sm:max-w-md" />
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Duplicate for new edition</SheetTitle>
          <SheetDescription>
            Copy <span className="font-mono">{source.slug}</span> into a new
            event. Registrations stay on the original edition; ticket types are
            copied with zero sales.
          </SheetDescription>
        </SheetHeader>

        <form className="flex flex-1 flex-col gap-5 px-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="newSlug">New slug</Label>
            <Input
              id="newSlug"
              className="font-mono text-sm"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Public URL: /events/{newSlug || "…"} and /register/{newSlug || "…"}
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edition">Edition label</Label>
            <Input
              id="edition"
              value={edition}
              onChange={(e) => setEdition(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dateShort">Date (short)</Label>
            <Input
              id="dateShort"
              value={dateShort}
              onChange={(e) => setDateShort(e.target.value)}
            />
          </div>

          <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-start gap-2">
              <Checkbox
                id="publishNew"
                checked={publishNew}
                onCheckedChange={(c) => setPublishNew(!!c)}
              />
              <Label htmlFor="publishNew" className="font-normal leading-snug">
                Publish the new edition immediately (shows on the public site
                when it is the latest published event)
              </Label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="unpublishSource"
                checked={unpublishSource}
                disabled={!source.isPublished}
                onCheckedChange={(c) => setUnpublishSource(!!c)}
              />
              <Label htmlFor="unpublishSource" className="font-normal leading-snug">
                Unpublish {source.slug} (keeps all 2026 registrations; hides
                from public listings)
              </Label>
            </div>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <SheetFooter className="mt-auto px-0 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Duplicating…" : "Create edition"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
