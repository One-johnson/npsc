import { CheckCircle2, QrCode } from "lucide-react";
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
              Register once. Check in with a tap.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Complete your delegate registration online, pay securely through
              Hubtel, and receive your QR ticket instantly.
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
              <div className="mx-auto flex aspect-square max-w-[180px] items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-muted/50">
                <QrCode className="size-24 text-primary/40" />
              </div>
              <p className="text-center text-xs text-muted-foreground">
                {mockEvent.edition} � {mockEvent.dateShort} � UPSA Auditorium
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
