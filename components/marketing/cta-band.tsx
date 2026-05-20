import { ArrowRight } from "lucide-react";
import { RegisterButton } from "@/components/registration/register-button";
import { mockEvent } from "@/lib/mock-event";

export function CtaBand() {
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-20">
      <div className="container mx-auto max-w-6xl px-4 text-center md:px-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">
          NPSC {mockEvent.edition} · {mockEvent.dateShort}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          Secure your seat today
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
          Join Ghana&apos;s premier procurement and supply chain conference at UPSA
          Auditorium, Accra.
        </p>
        <RegisterButton
          size="lg"
          className="mt-8 h-11 bg-white px-8 text-base font-semibold text-primary hover:bg-white/90"
        >
          Register now
          <ArrowRight className="ml-1 size-4" />
        </RegisterButton>
      </div>
    </section>
  );
}
