"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format-price";
import type { PublicEventBundle } from "@/lib/event/types";
import {
  attendeeRegistrationSchema,
  type AttendeeRegistrationData,
} from "@/lib/validations/registration";

const KIND_LABELS: Record<string, string> = {
  participant: "Participant",
  vip: "VIP",
  speaker: "Speaker",
  sponsor: "Sponsor",
  exhibitor: "Exhibitor",
  media: "Media",
};

type Props = {
  data: PublicEventBundle;
};

export function EventRegistrationPage({ data }: Props) {
  const { event, ticketTypes } = data;
  const eventFull = event.registeredCount >= event.capacity;
  const registerAttendee = useMutation(api.registrations.registerAttendee);
  const [activeKind, setActiveKind] = useState<string>(
    ticketTypes[0]?.kind ?? "participant"
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const activeTicket =
    ticketTypes.find((t) => t.kind === activeKind) ?? ticketTypes[0];

  const form = useForm<AttendeeRegistrationData>({
    resolver: zodResolver(attendeeRegistrationSchema),
    defaultValues: {
      ticketTypeId: activeTicket?.id ?? "",
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      position: "",
    },
  });

  function selectKind(kind: string) {
    setActiveKind(kind);
    const ticket = ticketTypes.find((t) => t.kind === kind);
    if (ticket) {
      form.setValue("ticketTypeId", ticket.id);
    }
    setError(null);
    setSuccess(null);
  }

  async function onSubmit(values: AttendeeRegistrationData) {
    setError(null);
    setSuccess(null);
    try {
      const result = await registerAttendee({
        eventSlug: event.slug,
        ticketTypeId: values.ticketTypeId as Id<"ticketTypes">,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        organization: values.organization,
        position: values.position,
      });
      if (result.outcome === "waitlisted") {
        setSuccess(
          `You’re on the waitlist (position ${result.waitlistPosition}). Save this code: ${result.confirmationCode}`
        );
      } else {
        setSuccess(
          `Registration received. Confirmation: ${result.confirmationCode}`
        );
      }
      form.reset({
        ticketTypeId: activeTicket?.id ?? "",
        fullName: "",
        email: "",
        phone: "",
        organization: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  }

  if (ticketTypes.length === 0) {
    return (
      <p className="py-24 text-center text-muted-foreground">
        No ticket types are available for this event yet.
      </p>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          {event.edition}
        </p>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">{event.titleLine2}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {event.date} · {event.venue}, {event.city}
        </p>
      </div>

      <Tabs
        value={activeKind}
        onValueChange={selectKind}
        className="mt-10"
      >
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted/50 p-1">
          {ticketTypes.map((ticket) => (
            <TabsTrigger
              key={ticket.id}
              value={ticket.kind}
              className="flex-1 min-w-[7rem] data-active:bg-background"
            >
              {KIND_LABELS[ticket.kind] ?? ticket.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {ticketTypes.map((ticket) => {
          const spotsLeft = ticket.capacity - ticket.soldCount;
          const tierSoldOut = spotsLeft <= 0;
          const waitlistOnly = eventFull || tierSoldOut;

          return (
            <TabsContent key={ticket.id} value={ticket.kind} className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle>{ticket.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {ticket.description}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {ticket.price > 0
                          ? formatPrice(ticket.price, ticket.currency)
                          : "Complimentary"}
                      </p>
                      <Badge
                        variant={waitlistOnly ? "outline" : "secondary"}
                        className="mt-2"
                      >
                        {waitlistOnly
                          ? eventFull
                            ? "Event at capacity"
                            : "Pass sold out"
                          : `${spotsLeft} spots left`}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {ticket.perks.length > 0 ? (
                    <ul className="mb-6 list-inside list-disc text-sm text-muted-foreground">
                      {ticket.perks.map((perk) => (
                        <li key={perk}>{perk}</li>
                      ))}
                    </ul>
                  ) : null}

                  {waitlistOnly ? (
                    <p className="mb-4 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:text-amber-100">
                      {eventFull
                        ? "The conference has reached its overall capacity. You can still join the waitlist for this pass type."
                        : "This pass is full. Join the waitlist and we will contact you if a seat opens."}
                    </p>
                  ) : null}

                  <form
                    className="grid gap-4 sm:grid-cols-2"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <input
                      type="hidden"
                      {...form.register("ticketTypeId")}
                      value={ticket.id}
                    />
                    <Field
                      label="Full name"
                      id={`fullName-${ticket.kind}`}
                      error={form.formState.errors.fullName?.message}
                      inputProps={form.register("fullName")}
                    />
                    <Field
                      label="Email"
                      id={`email-${ticket.kind}`}
                      type="email"
                      error={form.formState.errors.email?.message}
                      inputProps={form.register("email")}
                    />
                    <Field
                      label="Phone"
                      id={`phone-${ticket.kind}`}
                      error={form.formState.errors.phone?.message}
                      inputProps={form.register("phone")}
                    />
                    <Field
                      label="Company or organization"
                      id={`org-${ticket.kind}`}
                      error={form.formState.errors.organization?.message}
                      inputProps={form.register("organization")}
                    />
                    <Field
                      label="Position"
                      id={`position-${ticket.kind}`}
                      error={form.formState.errors.position?.message}
                      inputProps={form.register("position")}
                    />
                    <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting
                          ? "Submitting…"
                          : waitlistOnly
                            ? "Join waitlist"
                            : "Register"}
                      </Button>
                      <Link
                        href="/"
                        className={cn(
                          "inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted"
                        )}
                      >
                        Back to home
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {error ? (
        <p className="mt-4 text-center text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="mt-4 text-center text-sm text-primary" role="status">
          {success}
        </p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  id,
  className,
  error,
  inputProps,
  type = "text",
}: {
  label: string;
  id: string;
  className?: string;
  error?: string;
  inputProps: React.ComponentProps<typeof Input>;
  type?: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} className="h-11" {...inputProps} />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
