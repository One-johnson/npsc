import type { AttendeeRegistrationData } from "@/lib/validations/registration";
import type { TicketTypeOption } from "@/lib/event/types";

const KEY = "event_pending_registration";

function generateConfirmationCode(): string {
  const segment = () =>
    Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EVT-${segment()}-${segment()}`;
}

export type PendingRegistration = AttendeeRegistrationData & {
  eventSlug: string;
  ticketTypeName: string;
  ticketKind: string;
  price: number;
  currency: string;
  isLive: boolean;
  createdAt: string;
  confirmationCode?: string;
};

export function savePendingRegistration(
  eventSlug: string,
  ticket: TicketTypeOption,
  data: AttendeeRegistrationData,
  isLive: boolean,
  confirmationCode?: string
): PendingRegistration {
  const pending: PendingRegistration = {
    ...data,
    eventSlug,
    ticketTypeId: ticket.id,
    ticketTypeName: ticket.name,
    ticketKind: ticket.kind,
    price: ticket.price,
    currency: ticket.currency,
    isLive,
    createdAt: new Date().toISOString(),
    confirmationCode: confirmationCode ?? generateConfirmationCode(),
  };
  if (typeof window !== "undefined") {
    sessionStorage.setItem(KEY, JSON.stringify(pending));
  }
  return pending;
}

export function getPendingRegistration(): PendingRegistration | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw?.trim()) return null;
  try {
    return JSON.parse(raw) as PendingRegistration;
  } catch {
    sessionStorage.removeItem(KEY);
    return null;
  }
}

export function clearPendingRegistration() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(KEY);
  }
}
