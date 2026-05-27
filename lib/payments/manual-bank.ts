/** Manual bank transfer while Hubtel checkout is pending approval. */
export const MANUAL_BANK_PAYMENT = {
  accountName: "Ghana Institute of Procurement and Supply",
  bankName: "ADB",
  accountNumber: "1161000112225801",
  branch: "ADB House",
} as const;

export function formatManualBankPaymentCopy(): string {
  return [
    `Account name: ${MANUAL_BANK_PAYMENT.accountName}`,
    `Bank name: ${MANUAL_BANK_PAYMENT.bankName}`,
    `A/C No.: ${MANUAL_BANK_PAYMENT.accountNumber}`,
    `Branch: ${MANUAL_BANK_PAYMENT.branch}`,
  ].join("\n");
}

export function formatBankPaymentCopyText(referenceCode?: string): string {
  const lines = [
    `Account name: ${MANUAL_BANK_PAYMENT.accountName}`,
    `Bank name: ${MANUAL_BANK_PAYMENT.bankName}`,
    `A/C No.: ${MANUAL_BANK_PAYMENT.accountNumber}`,
    `Branch: ${MANUAL_BANK_PAYMENT.branch}`,
  ];
  if (referenceCode) {
    lines.push(`Reference (memo): ${referenceCode}`);
  }
  return lines.join("\n");
}
