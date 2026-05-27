"use client";

import {
  Award,
  CreditCard,
  Shield,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";
import type { EventFeature } from "@/lib/mock-event";
import { mockEvent } from "@/lib/mock-event";
import { fadeUp, staggerContainer, MotionSection } from "@/components/motion";

const iconMap: Record<EventFeature["icon"], LucideIcon> = {
  zap: Zap,
  shield: Shield,
  users: Users,
  award: Award,
  "credit-card": CreditCard,
};

export function FeatureGrid() {
  return (
    <MotionSection className="py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Why choose us"
          title="Everything you need for a smooth event day"
          description="From registration to certificate issuance, everything runs in one place."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {mockEvent.features.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div key={feature.title} variants={fadeUp}>
                <Card className="border-border/80">
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </MotionSection>
  );
}
