import type { Doc } from "../_generated/dataModel";

/** Pass kinds hidden from public registration; still managed in admin. */
export const SELF_SERVICE_EXCLUDED_TICKET_KINDS = [
  "sponsor",
  "vip",
  "media",
] as const;

export type TicketTypeKind = Doc<"ticketTypes">["kind"];

export function isSelfServiceTicketKind(kind: TicketTypeKind): boolean {
  return !(SELF_SERVICE_EXCLUDED_TICKET_KINDS as readonly string[]).includes(
    kind
  );
}

export function filterSelfServiceTicketTypes<
  T extends { kind: TicketTypeKind },
>(ticketTypes: T[]): T[] {
  return ticketTypes.filter((t) => isSelfServiceTicketKind(t.kind));
}
