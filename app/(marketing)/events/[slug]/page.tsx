import { notFound } from "next/navigation";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RegisterButton } from "@/components/registration/register-button";
import { SchedulePreview } from "@/components/marketing/schedule-preview";
import { PricingTeaser } from "@/components/marketing/pricing-teaser";
import { getEventBySlug, mockEvent } from "@/lib/mock-event";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  return (
    <>
      <section className="border-b border-border bg-primary py-16 text-primary-foreground md:py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <Badge className="mb-4 bg-[var(--brand-red)] text-white hover:bg-[var(--brand-red)]">
            {event.edition}
          </Badge>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">
            {event.title}
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{event.titleLine2}</h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/85">{event.about}</p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <span className="inline-flex items-center gap-2">
              <Calendar className="size-4" />
              {event.date}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" />
              {event.venue}, {event.city}
            </span>
          </div>
          <RegisterButton
            size="lg"
            className="mt-8 bg-white text-primary hover:bg-white/90"
          >
            Register for NPSC
            <ArrowRight className="ml-1 size-4" />
          </RegisterButton>
        </div>
      </section>
      <SchedulePreview />
      <PricingTeaser />
    </>
  );
}

export function generateStaticParams() {
  return [{ slug: mockEvent.slug }];
}
