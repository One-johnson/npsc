"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
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
      <p className="font-semibold text-foreground">Pay with Mobile Money</p>
      <p className="mt-1 text-muted-foreground">
        Online card and bank checkout is coming soon. For now, send payment to
        the account below ({MANUAL_MOMO_PAYMENT.networks}).
      </p>

      <dl className="mt-4 space-y-3">
        <CopyRow label="MoMo number" value={MANUAL_MOMO_PAYMENT.number} />
        <CopyRow
          label="Account name"
          value={MANUAL_MOMO_PAYMENT.accountName}
        />
        {amount !== undefined && amount > 0 ? (
          <div className="flex items-start justify-between gap-3">
            <dt className="text-muted-foreground">Amount</dt>
            <dd className="text-right font-semibold text-foreground">
              {formatPrice(amount, currency)}
            </dd>
          </div>
        ) : null}
        {referenceCode ? (
          <CopyRow label="Reference (memo)" value={referenceCode} mono />
        ) : null}
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
