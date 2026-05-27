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
          className="mx-auto mt-12 max-w-lg"
        >
          <motion.div variants={fadeUp}>
            <Card className="ring-2 ring-primary">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Conference registration</CardTitle>
                <p className="pt-2 text-4xl font-bold text-primary">
                  {formatPrice(
                    mockEvent.registrationFee,
                    mockEvent.registrationCurrency
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {mockEvent.date} · {mockEvent.venue}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.ul variants={staggerContainer} className="space-y-2">
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
                <RegisterButton className="h-11 w-full text-base" size="lg">
                  Register now
                </RegisterButton>
                <ManualMoMoPaymentInstructions
                  amount={mockEvent.registrationFee}
                  currency={mockEvent.registrationCurrency}
                  showSteps={false}
                  className="text-left"
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </MotionSection>
  );
}
