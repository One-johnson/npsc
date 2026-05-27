"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { RegisterButton } from "@/components/registration/register-button";
import { mockEvent } from "@/lib/mock-event";
import { fadeUp, staggerContainer } from "@/components/motion";

export function CtaBand() {
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-20">
      <div className="container mx-auto max-w-6xl px-4 text-center md:px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80"
          >
            NPSC {mockEvent.edition} · {mockEvent.dateShort}
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-3 text-3xl font-bold tracking-tight md:text-4xl"
          >
            Secure your seat today
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-xl text-primary-foreground/85"
          >
            Join Ghana&apos;s premier procurement and supply chain conference at
            UPSA Auditorium, Accra.
          </motion.p>
          <motion.div variants={fadeUp}>
            <RegisterButton
              size="lg"
              className="mt-8 h-11 bg-white px-8 text-base font-semibold text-primary hover:bg-white/90"
            >
              Register now
              <ArrowRight className="ml-1 size-4" />
            </RegisterButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
