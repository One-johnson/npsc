/** Signed ticket payload for check-in QR codes (HMAC-SHA256). */

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) {
    binary += String.fromCharCode(b);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function signTicketQrPayload(
  registrationId: string,
  confirmationCode: string,
  secret: string
): Promise<string> {
  if (!secret) {
    return `EVT:${confirmationCode}`;
  }
  const message = `${registrationId}:${confirmationCode}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );
  const sig = base64UrlEncode(new Uint8Array(signature));
  return `v1.${registrationId}.${confirmationCode}.${sig}`;
}

export function getTicketQrSigningSecret(): string {
  return process.env.TICKET_QR_SIGNING_SECRET ?? "";
}
