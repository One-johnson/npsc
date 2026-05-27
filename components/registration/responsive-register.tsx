"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useRegistrationFlow } from "@/components/registration/registration-flow-provider";
import { EventRegistrationPage } from "@/components/registration/event-registration-page";
import { Button } from "@/components/ui/button";
import { useConferenceEvent } from "@/hooks/use-conference-event";
import { useIsMobile } from "@/hooks/use-mobile";

export function ResponsiveRegister({ slug }: { slug: string }) {
  const isMobile = useIsMobile();
  const { bundle, isLoading } = useConferenceEvent(slug);
  const { openRegistration } = useRegistrationFlow();

  const backHref = useMemo(() => `/events/${encodeURIComponent(slug)}`, [slug]);

  if (isMobile) {
    if (isLoading) {
      return (
        <p className="py-24 text-center text-muted-foreground">Loading…</p>
      );
    }

    return (
      <>
        <div className="container mx-auto max-w-4xl px-4 pt-8 md:px-6">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href={backHref} />}
            className="-ml-2"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
        </div>
        <EventRegistrationPage data={bundle} />
      </>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" nativeButton={false} render={<Link href={backHref} />}>
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          {bundle.event.edition}
        </p>
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">
          Register for {bundle.event.titleLine2}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Choose your pass type and complete your registration in the dialog.
        </p>

        <Button
          size="lg"
          className="mt-8 h-11 px-8 text-base"
          onClick={() => openRegistration()}
        >
          Choose pass type
        </Button>
      </div>
    </div>
  );
}

