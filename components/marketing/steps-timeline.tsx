"use client";

import { SectionHeading } from "@/components/marketing/section-heading";
import { mockEvent } from "@/lib/mock-event";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, MotionSection } from "@/components/motion";

export function StepsTimeline() {
  return (
    <MotionSection className="bg-secondary/15 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="Register in four simple steps"
          description="Choose your pass type, register, pay, and download your certificate when issued."
        />
        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {mockEvent.steps.map((step) => (
            <motion.li key={step.step} variants={fadeUp} className="relative">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {step.step}
              </span>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </MotionSection>
  );
}
