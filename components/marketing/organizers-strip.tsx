"use client";

import Image from "next/image";
import { mockEvent } from "@/lib/mock-event";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, MotionSection } from "@/components/motion";

export function OrganizersStrip() {
  return (
    <MotionSection className="border-b border-border/60 bg-secondary/25 py-8 md:py-10">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Convened by
        </p>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-6 grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-6 sm:grid-cols-4 md:gap-x-10"
        >
          {mockEvent.organizers.map((organizer) => (
            <motion.div key={organizer.name} variants={fadeUp} className="w-full">
              <div
                className="flex h-20 w-full items-center justify-center sm:h-24"
                title={organizer.name}
              >
                <Image
                  src={organizer.logo}
                  alt={organizer.name}
                  width={220}
                  height={96}
                  className="max-h-16 w-auto object-contain sm:max-h-20"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </MotionSection>
  );
}
