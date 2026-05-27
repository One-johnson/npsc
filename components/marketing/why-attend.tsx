"use client";

import { SectionHeading } from "@/components/marketing/section-heading";
import { mockEvent } from "@/lib/mock-event";
import { MotionSection } from "@/components/motion";

export function WhyAttend() {
  return (
    <MotionSection
      id="about"
      className="border-y border-border/60 bg-muted/20 py-16 md:py-24"
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Why attend"
          title="Built for builders, designed for connection"
          description={mockEvent.about}
        />
      </div>
    </MotionSection>
  );
}
