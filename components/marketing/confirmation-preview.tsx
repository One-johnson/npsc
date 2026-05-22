import { Award, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockEvent } from "@/lib/mock-event";

export function ConfirmationPreview() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Register once. Track everything online.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Complete your delegate registration, pay securely through Hubtel,
              and receive your certificate of attendance from GIPS after the event.
            </p>
          </div>
          <Card className="mx-auto w-full max-w-sm shadow-lg ring-2 ring-primary/15">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="size-5" />
                <span className="text-sm font-medium">Confirmed</span>
              </div>
              <CardTitle className="text-lg">You&apos;re registered!</CardTitle>
              <CardDescription>{mockEvent.titleLine2}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mx-auto flex aspect-[4/3] max-w-[220px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-muted/50 px-4 py-6">
                <Award className="size-16 text-primary/50" />
                <p className="mt-3 text-center text-xs font-medium text-primary">
                  Certificate of attendance
                </p>
              </div>
              <p className="text-center text-xs text-muted-foreground">
                {mockEvent.edition} · {mockEvent.dateShort} · UPSA Auditorium
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
