"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterButton } from "@/components/registration/register-button";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ManualMoMoPaymentInstructions } from "@/components/payments/manual-momo-payment-instructions";
import { formatPrice, mockEvent } from "@/lib/mock-event";
import { fadeUp, staggerContainer, MotionSection } from "@/components/motion";

const included = [
  "Full 2-day conference access",
  "Secure online registration",
  "Mobile Money or bank transfer to GIPS",
  "Networking sessions & exhibition",
  "Certificate of attendance (issued after the event by GIPS)",
];

const exhibitorIncluded = [
  "One exhibition booth",
  "Meals for one representative",
  "One table and two chairs",
  "Space allocation only (branding and booth customization excluded)",
];

export function PricingTeaser() {
  return (
    <MotionSection
      id="register"
      className="border-y border-border/60 bg-muted/20 py-16 md:py-24"
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Registration"
          title="Secure your conference seat"
          description="Register online, then pay via Mobile Money or bank transfer using the GIPS details on this page."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12"
        >
          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            <motion.div variants={fadeUp}>
              <Card className="ring-2 ring-primary">
                <CardHeader className="text-left">
                  <CardTitle className="text-xl">Registration details</CardTitle>
                  <div className="pt-3 space-y-1">
                    <p className="text-base font-semibold text-foreground">
                      Participant:{" "}
                      <span className="font-bold text-primary">
                        {formatPrice(1500, "GHS")}
                      </span>
                    </p>
                    <p className="text-base font-semibold text-foreground">
                      Student:{" "}
                      <span className="font-bold text-primary">
                        {formatPrice(200, "GHS")}
                      </span>{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        (student ID upload required)
                      </span>
                    </p>
                    <p className="text-base font-semibold text-foreground">
                      Exhibition Package:{" "}
                      <span className="font-bold text-primary">
                        {formatPrice(5000, "GHS")}
                      </span>
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mockEvent.date} · {mockEvent.venue}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold">
                        Conference passes include
                      </p>
                      <motion.ul
                        variants={staggerContainer}
                        className="mt-2 space-y-2"
                      >
                        {included.map((item) => (
                          <motion.li
                            key={item}
                            variants={fadeUp}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                            {item}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        Exhibition Package includes
                      </p>
                      <motion.ul
                        variants={staggerContainer}
                        className="mt-2 space-y-2"
                      >
                        {exhibitorIncluded.map((item) => (
                          <motion.li
                            key={item}
                            variants={fadeUp}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                            {item}
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  </div>

                  <RegisterButton className="h-11 w-full text-base" size="lg">
                    Register now
                  </RegisterButton>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card>
                <CardHeader className="text-left">
                  <CardTitle className="text-xl">Payment details</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    After registering, complete payment using the GIPS Mobile Money
                    or bank transfer instructions below.
                  </p>
                </CardHeader>
                <CardContent>
                  <ManualMoMoPaymentInstructions
                    amount={1500}
                    currency="GHS"
                    showSteps={false}
                    className="text-left"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </MotionSection>
  );
}
