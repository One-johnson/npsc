import { PaymentsPanel } from "@/components/admin/payments-panel";

export const metadata = {
  title: "Payments",
};

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="mt-1 text-muted-foreground">
          View completed payments and record manual bank or MoMo transfers for
          pending registrations. Online Hubtel checkout will appear here when
          configured.
        </p>
      </div>
      <PaymentsPanel />
    </div>
  );
}
