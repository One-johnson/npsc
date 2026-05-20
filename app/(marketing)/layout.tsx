import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RegistrationFlowProvider } from "@/components/registration/registration-flow-provider";
import { Toaster } from "@/components/ui/sonner";
import { mockEvent } from "@/lib/mock-event";

export const metadata: Metadata = {
  title: `${mockEvent.edition} | ${mockEvent.titleLine2}`,
  description: mockEvent.tagline,
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RegistrationFlowProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Toaster />
    </RegistrationFlowProvider>
  );
}
