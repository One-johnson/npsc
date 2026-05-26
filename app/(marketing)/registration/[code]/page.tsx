import { RegistrationStatusContent } from "@/components/registration/registration-status-content";
import { mockEvent } from "@/lib/mock-event";

type Props = {
  params: Promise<{ code: string }>;
};

export default async function RegistrationStatusPage({ params }: Props) {
  const { code } = await params;
  const decoded = decodeURIComponent(code);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-bold">Registration status</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mockEvent.titleLine2} · {mockEvent.dateShort}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Save your reference code to check payment status or download your
            certificate when issued.
          </p>
          <RegistrationStatusContent confirmationCode={decoded} />
        </div>
      </div>
    </section>
  );
}
