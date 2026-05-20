import { Badge } from "@/components/ui/badge";
import { PartnersCarousel } from "@/components/marketing/partners-carousel";
import { mockEvent } from "@/lib/mock-event";

export function ProofStrip() {
  return (
    <section className="border-b border-border/60 bg-muted/30 py-8 md:py-12">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Badge variant="secondary" className="text-sm">
            {mockEvent.registeredCount}+ delegates registered
          </Badge>
          <span className="hidden text-muted-foreground sm:inline">·</span>
          <p className="text-center text-sm text-muted-foreground">
            {mockEvent.website}
          </p>
        </div>
        <PartnersCarousel />
      </div>
    </section>
  );
}
