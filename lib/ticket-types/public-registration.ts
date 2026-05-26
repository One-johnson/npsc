/** Pass kinds hidden from public registration; still visible in admin. */
export const SELF_SERVICE_EXCLUDED_TICKET_KINDS = [
  "sponsor",
  "vip",
  "media",
] as const;

export function isSelfServiceTicketKind(kind: string): boolean {
  return !(SELF_SERVICE_EXCLUDED_TICKET_KINDS as readonly string[]).includes(
    kind
  );
}

export function filterSelfServiceTicketTypes<
  T extends { kind: string },
>(ticketTypes: T[]): T[] {
  return ticketTypes.filter((t) => isSelfServiceTicketKind(t.kind));
}
