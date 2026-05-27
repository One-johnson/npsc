import { Hero } from "@/components/marketing/hero";
import { OrganizersStrip } from "@/components/marketing/organizers-strip";
import { ProofStrip } from "@/components/marketing/proof-strip";
import { ConfirmationPreview } from "@/components/marketing/confirmation-preview";
import { WhyAttend } from "@/components/marketing/why-attend";
import { FeatureGrid } from "@/components/marketing/feature-grid";
import { AudienceCarousel } from "@/components/marketing/audience-carousel";
import { StepsTimeline } from "@/components/marketing/steps-timeline";
import { PricingTeaser } from "@/components/marketing/pricing-teaser";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { CtaBand } from "@/components/marketing/cta-band";

export default function HomePage() {
  return (
    <>
      <Hero />
      <OrganizersStrip />
      <ProofStrip />
      <ConfirmationPreview />
      <WhyAttend />
      <FeatureGrid />
      <AudienceCarousel />
      <StepsTimeline />
      <PricingTeaser />
      <FaqAccordion />
      <CtaBand />
    </>
  );
}
