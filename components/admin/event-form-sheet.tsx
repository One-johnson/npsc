"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { EventHeroUpload } from "@/components/admin/event-hero-upload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  adminEventFormSchema,
  slugifyEventTitle,
  type AdminEventFormValues,
} from "@/lib/validations/admin-event";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionToken: string;
  mode: "create" | "edit";
  event?: Doc<"events"> | null;
  onSaved?: (eventId: Id<"events">) => void;
};

function eventToFormValues(event: Doc<"events">): AdminEventFormValues {
  return {
    organizationId: event.organizationId,
    slug: event.slug,
    edition: event.edition,
    title: event.title,
    titleLine2: event.titleLine2,
    subtitle: event.subtitle,
    tagline: event.tagline,
    date: event.date,
    dateShort: event.dateShort,
    time: event.time,
    venue: event.venue,
    city: event.city,
    country: event.country,
    website: event.website,
    capacity: event.capacity,
    about: event.about,
    isPublished: event.isPublished,
  };
}

const DEFAULT_VALUES: AdminEventFormValues = {
  organizationId: "",
  slug: "",
  edition: "",
  title: "",
  titleLine2: "",
  subtitle: "",
  tagline: "",
  date: "",
  dateShort: "",
  time: "",
  venue: "",
  city: "Accra",
  country: "Ghana",
  website: "",
  capacity: 500,
  about: "",
  isPublished: false,
};

export function EventFormSheet({
  open,
  onOpenChange,
  sessionToken,
  mode,
  event,
  onSaved,
}: Props) {
  const organizations = useQuery(
    api.events.listOrganizations,
    sessionToken ? { sessionToken } : "skip"
  );
  const createEvent = useMutation(api.events.create);
  const updateEvent = useMutation(api.events.update);

  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [heroStorageId, setHeroStorageId] = useState<Id<"_storage"> | null>(
    null
  );
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<AdminEventFormValues>({
    resolver: zodResolver(adminEventFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const isPublished = form.watch("isPublished");
  const titleLine2 = form.watch("titleLine2");

  useEffect(() => {
    if (!open) return;
    setSubmitError(null);
    setHeroStorageId(null);
    if (mode === "edit" && event) {
      form.reset(eventToFormValues(event));
      setHeroPreview(
        event.heroImage.startsWith("http") || event.heroImage.startsWith("/")
          ? event.heroImage
          : null
      );
      setSlugTouched(true);
    } else {
      form.reset(DEFAULT_VALUES);
      setHeroPreview(null);
      setSlugTouched(false);
      if (organizations?.length === 1) {
        form.setValue("organizationId", organizations[0]._id);
      }
    }
  }, [open, mode, event, form, organizations]);

  useEffect(() => {
    if (mode === "create" && !slugTouched && titleLine2) {
      form.setValue("slug", slugifyEventTitle(titleLine2));
    }
  }, [titleLine2, slugTouched, mode, form]);

  async function onSubmit(values: AdminEventFormValues) {
    setSubmitError(null);
    try {
      const payload = {
        sessionToken,
        organizationId: values.organizationId as Id<"organizations">,
        slug: values.slug,
        edition: values.edition,
        title: values.title,
        titleLine2: values.titleLine2,
        subtitle: values.subtitle,
        tagline: values.tagline,
        date: values.date,
        dateShort: values.dateShort,
        time: values.time,
        venue: values.venue,
        city: values.city,
        country: values.country,
        website: values.website,
        capacity: values.capacity,
        about: values.about,
        isPublished: values.isPublished,
        ...(heroStorageId ? { heroStorageId } : {}),
      };

      if (mode === "create") {
        const eventId = await createEvent(payload);
        onSaved?.(eventId);
      } else if (event) {
        await updateEvent({
          sessionToken,
          eventId: event._id,
          edition: values.edition,
          title: values.title,
          titleLine2: values.titleLine2,
          subtitle: values.subtitle,
          tagline: values.tagline,
          date: values.date,
          dateShort: values.dateShort,
          time: values.time,
          venue: values.venue,
          city: values.city,
          country: values.country,
          website: values.website,
          capacity: values.capacity,
          about: values.about,
          isPublished: values.isPublished,
          ...(heroStorageId ? { heroStorageId } : {}),
          organizers: event.organizers,
          agenda: event.agenda,
          features: event.features,
          audiences: event.audiences,
          steps: event.steps,
          faqs: event.faqs,
          partners: event.partners,
        });
        onSaved?.(event._id);
      }
      onOpenChange(false);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Save failed");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col overflow-y-auto sm:max-w-xl"
      >
        <SheetHeader>
          <SheetTitle>
            {mode === "create" ? "Create event" : "Edit event"}
          </SheetTitle>
          <SheetDescription>
            {mode === "create"
              ? "Add a new conference edition. Ticket types can be configured after saving."
              : "Update event details and hero image."}
          </SheetDescription>
        </SheetHeader>

        <form
          className="flex flex-1 flex-col gap-6 px-4 pb-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <EventHeroUpload
            sessionToken={sessionToken}
            previewUrl={heroPreview}
            onUploaded={(id, preview) => {
              setHeroStorageId(id);
              setHeroPreview(preview);
            }}
            onClear={() => {
              setHeroStorageId(null);
              setHeroPreview(null);
            }}
          />

          <Field label="Organization" error={form.formState.errors.organizationId?.message}>
            <Select
              value={form.watch("organizationId") || undefined}
              onValueChange={(v) =>
                form.setValue("organizationId", v ?? "", { shouldValidate: true })
              }
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations?.map((org) => (
                  <SelectItem key={org._id} value={org._id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Edition" error={form.formState.errors.edition?.message}>
              <Input className="h-10" {...form.register("edition")} />
            </Field>
            <Field label="Slug" error={form.formState.errors.slug?.message}>
              <Input
                className="h-10 font-mono text-sm"
                {...form.register("slug", {
                  onChange: () => setSlugTouched(true),
                })}
              />
            </Field>
          </div>

          <Field label="Title line 1" error={form.formState.errors.title?.message}>
            <Input className="h-10" {...form.register("title")} />
          </Field>
          <Field label="Headline" error={form.formState.errors.titleLine2?.message}>
            <Input className="h-10" {...form.register("titleLine2")} />
          </Field>
          <Field label="Subtitle" error={form.formState.errors.subtitle?.message}>
            <Input className="h-10" {...form.register("subtitle")} />
          </Field>

          <Field label="Tagline" error={form.formState.errors.tagline?.message}>
            <textarea
              className={cn(
                "flex min-h-[72px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              )}
              {...form.register("tagline")}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date" error={form.formState.errors.date?.message}>
              <Input className="h-10" {...form.register("date")} />
            </Field>
            <Field label="Date (short)" error={form.formState.errors.dateShort?.message}>
              <Input className="h-10" {...form.register("dateShort")} />
            </Field>
            <Field label="Time" error={form.formState.errors.time?.message}>
              <Input className="h-10" {...form.register("time")} />
            </Field>
            <Field label="Capacity" error={form.formState.errors.capacity?.message}>
              <Input
                type="number"
                min={1}
                className="h-10"
                {...form.register("capacity", { valueAsNumber: true })}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Venue" error={form.formState.errors.venue?.message}>
              <Input className="h-10" {...form.register("venue")} />
            </Field>
            <Field label="City" error={form.formState.errors.city?.message}>
              <Input className="h-10" {...form.register("city")} />
            </Field>
            <Field label="Country" error={form.formState.errors.country?.message}>
              <Input className="h-10" {...form.register("country")} />
            </Field>
            <Field label="Website" error={form.formState.errors.website?.message}>
              <Input className="h-10" {...form.register("website")} />
            </Field>
          </div>

          <Field label="About" error={form.formState.errors.about?.message}>
            <textarea
              className={cn(
                "flex min-h-[100px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              )}
              {...form.register("about")}
            />
          </Field>

          <div className="flex items-center gap-2">
            <Checkbox
              id="isPublished"
              checked={isPublished}
              onCheckedChange={(checked) =>
                form.setValue("isPublished", !!checked)
              }
            />
            <Label htmlFor="isPublished" className="font-normal">
              Publish event (visible on public site)
            </Label>
          </div>

          {submitError ? (
            <p className="text-sm text-destructive" role="alert">
              {submitError}
            </p>
          ) : null}

          <SheetFooter className="px-0 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Saving…"
                : mode === "create"
                  ? "Create event"
                  : "Save changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
