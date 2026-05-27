"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import { MANUAL_BANK_PAYMENT } from "@/lib/payments/manual-bank";
import {
  MANUAL_MOMO_PAYMENT,
  MANUAL_MOMO_PAYMENT_INSTRUCTIONS,
} from "@/lib/payments/manual-momo";
import { cn } from "@/lib/utils";

type Props = {
  amount?: number;
  currency?: string;
  referenceCode?: string;
  className?: string;
  showSteps?: boolean;
};

export function ManualMoMoPaymentInstructions({
  amount,
  currency = "GHS",
  referenceCode,
  className,
  showSteps = true,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm",
        className
      )}
    >
      <p className="font-semibold text-foreground">Payment details</p>
      <p className="mt-1 text-muted-foreground">
        Pay via Mobile Money ({MANUAL_MOMO_PAYMENT.networks}) or bank transfer.
        Include your registration reference in the payment memo.
      </p>

      {amount !== undefined && amount > 0 ? (
        <div className="mt-4 flex items-start justify-between gap-3 text-sm">
          <span className="text-muted-foreground">Amount</span>
          <span className="font-semibold text-foreground">
            {formatPrice(amount, currency)}
          </span>
        </div>
      ) : null}
      {referenceCode ? (
        <dl className="mt-4">
          <CopyRow label="Reference (memo)" value={referenceCode} mono />
        </dl>
      ) : null}

      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Mobile Money
      </p>
      <dl className="mt-2 space-y-3">
        <CopyRow label="MoMo number" value={MANUAL_MOMO_PAYMENT.number} />
        <CopyRow
          label="Account name"
          value={MANUAL_MOMO_PAYMENT.accountName}
        />
      </dl>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Bank transfer
      </p>
      <dl className="mt-2 space-y-3">
        <CopyRow
          label="Account name"
          value={MANUAL_BANK_PAYMENT.accountName}
        />
        <CopyRow label="Bank name" value={MANUAL_BANK_PAYMENT.bankName} />
        <CopyRow
          label="A/C No."
          value={MANUAL_BANK_PAYMENT.accountNumber}
          mono
        />
        <CopyRow label="Branch" value={MANUAL_BANK_PAYMENT.branch} />
      </dl>

      {showSteps ? (
        <ol className="mt-4 list-decimal space-y-1.5 pl-4 text-muted-foreground">
          {MANUAL_MOMO_PAYMENT_INSTRUCTIONS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

function CopyRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — please copy manually");
    }
  }

  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            "text-right font-medium text-foreground",
            mono && "font-mono text-xs"
          )}
        >
          {value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="shrink-0"
          onClick={() => void handleCopy()}
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </dd>
    </div>
  );
}
