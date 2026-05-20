import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegisterButton } from "@/components/registration/register-button";
import { SectionHeading } from "@/components/marketing/section-heading";
import { formatPrice, mockEvent } from "@/lib/mock-event";

const included = [
  "Full 2-day conference access",
  "Digital ticket with QR check-in",
  "Networking sessions & exhibition",
  "Certificate of attendance",
];

export function PricingTeaser() {
  return (
    <section id="tickets" className="border-y border-border/60 bg-muted/20 py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading
          eyebrow="Registration"
          title="Secure your conference seat"
          description="Register online, then complete payment via Hubtel — Mobile Money, card, or bank."
        />
        <Card className="mx-auto mt-12 max-w-lg ring-2 ring-primary">
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
            <ul className="space-y-2">
              {included.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <RegisterButton className="h-11 w-full text-base" size="lg">
              Register & pay
            </RegisterButton>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
