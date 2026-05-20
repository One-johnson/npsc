"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  GraduationCap,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { fadeUp, staggerContainer } from "@/components/motion";
import { mockEvent } from "@/lib/mock-event";
import { cn } from "@/lib/utils";

const audienceThemes: {
  icon: LucideIcon;
  card: string;
  iconWrap: string;
  title: string;
  description: string;
}[] = [
  {
    icon: Building2,
    card: "border-primary/25 bg-[oklch(0.97_0.02_155)] hover:border-primary/45 hover:bg-[oklch(0.95_0.04_155)] hover:shadow-lg hover:shadow-primary/10",
    iconWrap: "bg-primary/15 text-primary",
    title: "text-primary",
    description: "text-primary/80",
  },
  {
    icon: Truck,
    card: "border-[oklch(0.45_0.12_145/0.25)] bg-[oklch(0.96_0.03_145)] hover:border-[oklch(0.45_0.12_145/0.45)] hover:bg-[oklch(0.94_0.05_145)] hover:shadow-lg hover:shadow-[oklch(0.45_0.12_145/0.12)]",
    iconWrap: "bg-[oklch(0.45_0.12_145/0.15)] text-[oklch(0.38_0.1_145)]",
    title: "text-[oklch(0.32_0.09_145)]",
    description: "text-[oklch(0.38_0.08_145/0.85)]",
  },
  {
    icon: Briefcase,
    card: "border-[oklch(0.52_0.22_25/0.2)] bg-[oklch(0.98_0.02_25)] hover:border-[oklch(0.52_0.22_25/0.4)] hover:bg-[oklch(0.96_0.04_25)] hover:shadow-lg hover:shadow-[oklch(0.52_0.22_25/0.1)]",
    iconWrap: "bg-[oklch(0.52_0.22_25/0.12)] text-[oklch(0.45_0.18_25)]",
    title: "text-[oklch(0.38_0.14_25)]",
    description: "text-[oklch(0.45_0.12_25/0.85)]",
  },
  {
    icon: GraduationCap,
    card: "border-[oklch(0.82_0.16_95/0.35)] bg-[oklch(0.98_0.04_95)] hover:border-[oklch(0.75_0.14_95/0.55)] hover:bg-[oklch(0.96_0.06_95)] hover:shadow-lg hover:shadow-[oklch(0.82_0.16_95/0.15)]",
    iconWrap: "bg-[oklch(0.82_0.16_95/0.25)] text-[oklch(0.45_0.12_85)]",
    title: "text-[oklch(0.38_0.1_85)]",
    description: "text-[oklch(0.42_0.09_85/0.9)]",
  },
];

const hoverLift = {
  y: -8,
  scale: 1.02,
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};

export function AudienceCarousel() {
  return (
    <section className="border-y border-border/60 bg-muted/20 py-16 md:py-24">
      <motion.div className="container mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionHeading
            eyebrow="Who it's for"
            title="Who should attend"
            description="Procurement and supply professionals across public sector, industry, and academia."
          />
        </motion.div>

        <motion.div
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {mockEvent.audiences.map((segment, index) => {
            const theme = audienceThemes[index % audienceThemes.length];
            const Icon = theme.icon;

            return (
              <motion.div
                key={segment.id}
                variants={fadeUp}
                whileHover={hoverLift}
                className="cursor-default"
              >
                <Card
                  className={cn(
                    "group relative min-h-[220px] overflow-hidden border-2 py-0 shadow-sm transition-[border-color,box-shadow,background-color] duration-300 md:min-h-[240px]",
                    theme.card
                  )}
                >
                  <motion.div
                    className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full opacity-40 blur-2xl"
                    style={{
                      background:
                        index === 0
                          ? "var(--brand-green)"
                          : index === 1
                            ? "var(--ghana-green)"
                            : index === 2
                              ? "var(--brand-red)"
                              : "var(--ghana-gold)",
                    }}
                    aria-hidden
                    whileHover={{ scale: 1.2, opacity: 0.55 }}
                    transition={{ duration: 0.4 }}
                  />
                  <CardHeader className="relative space-y-4 px-6 pt-8 pb-2 md:px-8 md:pt-10">
                    <motion.div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 md:size-14",
                        theme.iconWrap
                      )}
                    >
                      <Icon className="size-6 md:size-7" strokeWidth={1.75} />
                    </motion.div>
                    <CardTitle
                      className={cn(
                        "text-xl leading-snug font-semibold md:text-2xl",
                        theme.title
                      )}
                    >
                      {segment.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative px-6 pb-8 md:px-8 md:pb-10">
                    <p
                      className={cn(
                        "text-base leading-relaxed md:text-lg",
                        theme.description
                      )}
                    >
                      {segment.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
