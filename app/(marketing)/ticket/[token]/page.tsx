import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TicketPageContent } from "@/components/ticket/ticket-page-content";
import { mockEvent } from "@/lib/mock-event";

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ pay?: string }>;
};

export default async function TicketPage({ params, searchParams }: Props) {
  const { token } = await params;
  const { pay } = await searchParams;
  const decoded = decodeURIComponent(token);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-bold">Your conference ticket</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mockEvent.titleLine2} · {mockEvent.dateShort}
          </p>
          <TicketPageContent token={decoded} openPayment={pay === "1"} />
        </div>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" disabled>
            Download PDF (soon)
          </Button>
          <Link href="/">
            <Button variant="ghost">Back to home</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
