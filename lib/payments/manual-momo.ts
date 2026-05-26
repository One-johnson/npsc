/** Manual Mobile Money collection while Hubtel checkout is pending approval. */
export const MANUAL_MOMO_PAYMENT = {
  number: "0201689882",
  /** Display formatting for the public site. */
  numberDisplay: "020 168 9882",
  accountName: "Ghana Institute of Procurement and Supply",
  networks: "MTN · Telecel · AirtelTigo",
} as const;

export const MANUAL_MOMO_PAYMENT_INSTRUCTIONS = [
  "Register online and save your reference code.",
  `Send the exact pass fee via Mobile Money to ${MANUAL_MOMO_PAYMENT.numberDisplay}.`,
  `Use your reference code as the payment description or memo.`,
  "GIPS will confirm your registration after payment is verified (usually within 1–2 business days).",
] as const;
