"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { mockEvent } from "@/lib/mock-event";
import { useConferenceEvent } from "@/hooks/use-conference-event";
import type { PublicEventBundle, TicketTypeOption } from "@/lib/event/types";
import type { AttendeeRegistrationData } from "@/lib/validations/registration";
import {
  clearPendingRegistration,
  savePendingRegistration,
  type PendingRegistration,
} from "@/lib/registration-storage";
import { TicketTypeDialog } from "@/components/registration/ticket-type-dialog";
import { RegistrationDialog } from "@/components/registration/registration-dialog";
import { PaymentDialog } from "@/components/registration/payment-dialog";

type RegistrationFlowContextValue = {
  openRegistration: (ticketKind?: string) => void;
  bundle: PublicEventBundle;
  isLoading: boolean;
};

const RegistrationFlowContext =
  createContext<RegistrationFlowContextValue | null>(null);

export function RegistrationFlowProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const eventSlug = useMemo(() => {
    const m = pathname.match(/^\/register\/([^/]+)/);
    return m?.[1] ? decodeURIComponent(m[1]) : mockEvent.slug;
  }, [pathname]);
  const { bundle, isLoading } = useConferenceEvent(eventSlug);
  const registerAttendee = useMutation(api.registrations.registerAttendee);

  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketTypeOption | null>(
    null
  );
  const [pending, setPending] = useState<PendingRegistration | null>(null);

  const openRegistration = useCallback(
    (ticketKind?: string) => {
      if (ticketKind) {
        const ticket = bundle.ticketTypes.find((t) => t.kind === ticketKind);
        if (ticket) {
          setSelectedTicket(ticket);
          setFormDialogOpen(true);
          return;
        }
      }

      setTicketDialogOpen(true);
    },
    [bundle]
  );

  const handleTicketSelect = useCallback((ticket: TicketTypeOption) => {
    setSelectedTicket(ticket);
    setTicketDialogOpen(false);
    setFormDialogOpen(true);
  }, []);

  const handleFormSuccess = useCallback(
    async (data: AttendeeRegistrationData) => {
      if (!selectedTicket) return;
      const eventFull =
        bundle.event.registeredCount >= bundle.event.capacity;
      const ticketSoldOut =
        selectedTicket.soldCount >= selectedTicket.capacity;
      if (
        bundle.isLive &&
        !selectedTicket.id.startsWith("mock-") &&
        (eventFull || ticketSoldOut)
      ) {
        try {
          const result = await registerAttendee({
            eventSlug: bundle.event.slug,
            ticketTypeId: selectedTicket.id as Id<"ticketTypes">,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            organization: data.organization,
            position: data.position,
          });
          setFormDialogOpen(false);
          setSelectedTicket(null);
          clearPendingRegistration();
          if (result.outcome === "waitlisted") {
            toast.message("You’re on the waitlist", {
              description: `Position ${result.waitlistPosition}. We’ll email you if a seat opens.`,
            });
          } else {
            toast.success("Registration saved", {
              description: `Confirmation ${result.confirmationCode}`,
            });
          }
          router.push(
            `/ticket/${encodeURIComponent(result.confirmationCode)}`
          );
        } catch (e) {
          toast.error(e instanceof Error ? e.message : "Could not join waitlist");
        }
        return;
      }

      const saved = savePendingRegistration(
        bundle.event.slug,
        selectedTicket,
        data,
        bundle.isLive
      );
      setPending(saved);
      setFormDialogOpen(false);
      setPaymentDialogOpen(true);
    },
    [bundle, registerAttendee, router, selectedTicket]
  );

  const handlePaymentComplete = useCallback(
    async (registration: PendingRegistration) => {
      if (bundle?.isLive && !registration.ticketTypeId.startsWith("mock-")) {
        const result = await registerAttendee({
          eventSlug: registration.eventSlug,
          ticketTypeId: registration.ticketTypeId as Id<"ticketTypes">,
          fullName: registration.fullName,
          email: registration.email,
          phone: registration.phone,
          organization: registration.organization,
          position: registration.position,
        });
        clearPendingRegistration();
        setPaymentDialogOpen(false);
        setSelectedTicket(null);
        setPending(null);
        if (result.outcome === "waitlisted") {
          toast.message("Event is at capacity — you’re on the waitlist", {
            description: `Position ${result.waitlistPosition}. Confirmation ${result.confirmationCode}`,
          });
        }
        router.push(
          `/ticket/${encodeURIComponent(result.confirmationCode)}`
        );
        return;
      }

      clearPendingRegistration();
      setPaymentDialogOpen(false);
      setSelectedTicket(null);
      setPending(null);
      router.push("/ticket/demo");
    },
    [bundle?.isLive, registerAttendee, router]
  );

  const value = useMemo(
    () => ({
      openRegistration,
      bundle,
      isLoading,
    }),
    [openRegistration, bundle, isLoading]
  );

  return (
    <RegistrationFlowContext.Provider value={value}>
      {children}

      <TicketTypeDialog
        bundle={bundle}
        open={ticketDialogOpen}
        onOpenChange={setTicketDialogOpen}
        onSelect={handleTicketSelect}
      />

      {selectedTicket ? (
        <RegistrationDialog
          bundle={bundle}
          ticket={selectedTicket}
          isWaitlistIntent={
            bundle.event.registeredCount >= bundle.event.capacity ||
            selectedTicket.soldCount >= selectedTicket.capacity
          }
          open={formDialogOpen}
          onOpenChange={(open) => {
            setFormDialogOpen(open);
            if (!open) setSelectedTicket(null);
          }}
          onSuccess={(data) => void handleFormSuccess(data)}
        />
      ) : null}

      {pending ? (
        <PaymentDialog
          bundle={bundle}
          registration={pending}
          open={paymentDialogOpen}
          onOpenChange={(open) => {
            setPaymentDialogOpen(open);
            if (!open) setPending(null);
          }}
          onComplete={() => void handlePaymentComplete(pending)}
        />
      ) : null}
    </RegistrationFlowContext.Provider>
  );
}

export function useRegistrationFlow() {
  const ctx = useContext(RegistrationFlowContext);
  if (!ctx) {
    throw new Error(
      "useRegistrationFlow must be used within RegistrationFlowProvider"
    );
  }
  return ctx;
}
