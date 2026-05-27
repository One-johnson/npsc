"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/marketing/section-heading";
import { mockEvent } from "@/lib/mock-event";
import { fadeUp, staggerContainer, MotionSection } from "@/components/motion";

export function FaqAccordion() {
  return (
    <MotionSection id="faq" className="py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything you need to know before you register."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-10 w-full"
        >
          <Accordion className="w-full">
            {mockEvent.faqs.map((faq, i) => (
              <motion.div key={faq.question} variants={fadeUp}>
                <AccordionItem value={`item-${i}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </MotionSection>
  );
}
