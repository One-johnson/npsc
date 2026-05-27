"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { RegisterButton } from "@/components/registration/register-button";
import { mockEvent } from "@/lib/mock-event";
import { fadeUp, staggerContainer } from "@/components/motion";

const Box = "div" as const;

export function Hero() {
  const spotsLeft = mockEvent.capacity - mockEvent.registeredCount;

  return (
    <section className="relative overflow-hidden border-b border-primary/20 bg-primary text-primary-foreground">
      <Box
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      <Box className="container relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-10 lg:grid-cols-2"
        >
          <Box>
            <motion.p
              variants={fadeUp}
              className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/80"
            >
              {mockEvent.title}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="mt-2 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]"
            >
              {mockEvent.titleLine2}
            </motion.h1>
            <motion.div variants={fadeUp} className="mt-4 inline-block">
              <span className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-2xl font-black uppercase tracking-wider shadow-lg md:text-3xl">
                {mockEvent.edition}
              </span>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-lg text-base text-primary-foreground/85 md:text-lg"
            >
              {mockEvent.tagline}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <RegisterButton
                size="lg"
                className="h-11 bg-white px-8 text-base font-semibold text-primary hover:bg-white/90"
              >
                Register now
                <ArrowRight className="ml-1 size-4" />
              </RegisterButton>
            </motion.div>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-sm text-primary-foreground/70"
            >
              {spotsLeft} seats remaining · {mockEvent.registeredCount} registered
            </motion.p>
          </Box>

          <motion.div variants={fadeUp} className="relative">
            <Box className="relative overflow-hidden rounded-2xl shadow-2xl ring-2 ring-primary-foreground/20">
              <Image
                src={mockEvent.heroImage}
                alt="Conference attendees at NPSC"
                width={640}
                height={480}
                className="h-auto w-full object-cover"
                priority
              />
            </Box>
            <Box className="mt-6 flex flex-wrap items-center gap-4">
              <Box className="rounded-xl bg-[var(--brand-red)] px-5 py-4 text-center shadow-lg">
                <p className="text-xs font-bold uppercase tracking-wider text-white/90">
                  Save the date
                </p>
                <p className="mt-1 text-lg font-black leading-tight text-white md:text-xl">
                  {mockEvent.dateShort}
                </p>
              </Box>
              <Box className="flex items-start gap-2 text-primary-foreground">
                <MapPin className="mt-0.5 size-5 shrink-0" />
                <Box>
                  <p className="text-sm font-bold uppercase tracking-wide">
                    {mockEvent.venue}
                  </p>
                  <p className="text-sm text-primary-foreground/80">
                    {mockEvent.city}, {mockEvent.country}
                  </p>
                </Box>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Box>
    </section>
  );
}
