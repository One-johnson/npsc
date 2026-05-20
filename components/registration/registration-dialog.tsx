"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format-price";
import type { PublicEventBundle, TicketTypeOption } from "@/lib/event/types";
import {
  attendeeRegistrationSchema,
  type AttendeeRegistrationData,
} from "@/lib/validations/registration";

type Props = {
  bundle: PublicEventBundle;
  ticket: TicketTypeOption;
  /** When true, submit joins the waitlist (skips payment until promoted). */
  isWaitlistIntent?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (data: AttendeeRegistrationData) => void | Promise<void>;
};

export function RegistrationDialog({
  bundle,
  ticket,
  isWaitlistIntent = false,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const { event } = bundle;

  const form = useForm<AttendeeRegistrationData>({
    resolver: zodResolver(attendeeRegistrationSchema),
    defaultValues: {
      ticketTypeId: ticket.id,
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      position: "",
    },
  });

  useEffect(() => {
    form.setValue("ticketTypeId", ticket.id);
  }, [ticket.id, form]);

  async function onSubmit(data: AttendeeRegistrationData) {
    await onSuccess({ ...data, ticketTypeId: ticket.id });
    form.reset({
      ticketTypeId: ticket.id,
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      position: "",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-6 p-6 sm:max-w-2xl sm:p-8">
        <DialogHeader className="gap-2 text-left">
          <DialogTitle className="text-xl sm:text-2xl">
            Register as {ticket.name}
          </DialogTitle>
          <DialogDescription>
            {event.titleLine2} · {event.dateShort}
          </DialogDescription>
          {isWaitlistIntent ? (
            <p className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-950 dark:text-amber-100">
              This pass or the conference is at capacity. Submitting adds you to
              the waitlist at no charge. We will contact you if a seat opens.
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="secondary">{ticket.name}</Badge>
            <span className="text-sm font-semibold text-primary">
              {ticket.price > 0
                ? formatPrice(ticket.price, ticket.currency)
                : "Complimentary"}
            </span>
          </div>
        </DialogHeader>
        <form
          className="grid gap-5 sm:grid-cols-2 sm:gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <input type="hidden" {...form.register("ticketTypeId")} />
          <Field
            label="Full name"
            id="fullName"
            error={form.formState.errors.fullName?.message}
            inputProps={form.register("fullName")}
          />
          <Field
            label="Email"
            id="email"
            type="email"
            error={form.formState.errors.email?.message}
            inputProps={form.register("email")}
          />
          <Field
            label="Phone"
            id="phone"
            error={form.formState.errors.phone?.message}
            inputProps={form.register("phone")}
          />
          <Field
            label="Company or organization"
            id="organization"
            error={form.formState.errors.organization?.message}
            inputProps={form.register("organization")}
          />
          <Field
            label="Position"
            id="position"
            error={form.formState.errors.position?.message}
            inputProps={form.register("position")}
          />
          <DialogFooter className="px-0 pb-0 sm:col-span-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {isWaitlistIntent
                ? form.formState.isSubmitting
                  ? "Submitting…"
                  : "Join waitlist"
                : form.formState.isSubmitting
                  ? "Submitting…"
                  : "Continue to payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
