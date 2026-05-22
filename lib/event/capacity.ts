import type { PublicEventBundle } from "@/lib/event/types";

/** True when every active pass type has no spots left. */
export function allActiveTicketTypesSoldOut(bundle: PublicEventBundle): boolean {
  const active = bundle.ticketTypes.filter((t) => t.isActive);
  if (active.length === 0) return false;
  return active.every((t) => t.soldCount >= t.capacity);
}
