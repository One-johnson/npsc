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
import { allActiveTicketTypesSoldOut } from "@/lib/event/capacity";
import { useConferenceEvent } from "@/hooks/use-conference-event";
import type { PublicEventBundle, TicketTypeOption } from "@/lib/event/types";
import type {
  AttendeeRegistrationData,
  PaymentData,
} from "@/lib/validations/registration";
import {
  clearPendingRegistration,
  savePendingRegistration,
  type PendingRegistration,
} from "@/lib/registration-storage";
import { TicketTypeDialog } from "@/components/registration/ticket-type-dialog";
import { RegistrationDialog } from "@/components/registration/registration-dialog";
import { PaymentDialog } from "@/components/registration/payment-dialog";
import {
  RegistrationFlowOverlay,
  delay,
  type RegistrationFlowOverlayState,
} from "@/components/registration/registration-flow-overlay";

type RegistrationFlowContextValue = {
  openRegistration: (ticketKind?: string) => void;
  bundle: PublicEventBundle;
  isLoading: boolean;
  /** All active pass types are sold out — CTA should offer waitlist. */
  allTicketTypesSoldOut: boolean;
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
  const confirmPayment = useMutation(api.payments.confirmRegistrationPayment);

  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketTypeOption | null>(
    null
  );
  const [pending, setPending] = useState<PendingRegistration | null>(null);
  const [overlay, setOverlay] = useState<RegistrationFlowOverlayState | null>(
    null
  );

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

  const handleFormBack = useCallback(() => {
    setFormDialogOpen(false);
    setTicketDialogOpen(true);
  }, []);

  const handlePaymentBack = useCallback(() => {
    if (!pending) return;
    const ticket = bundle.ticketTypes.find(
      (t) => t.id === pending.ticketTypeId
    );
    if (ticket) setSelectedTicket(ticket);
    setPaymentDialogOpen(false);
    setFormDialogOpen(true);
  }, [bundle.ticketTypes, pending]);

  const handleFormSuccess = useCallback(
    async (data: AttendeeRegistrationData) => {
      if (!selectedTicket) return;
      const eventFull =
        bundle.event.registeredCount >= bundle.event.capacity;
      const ticketSoldOut =
        selectedTicket.soldCount >= selectedTicket.capacity;
      const isWaitlist =
        bundle.isLive &&
        !selectedTicket.id.startsWith("mock-") &&
        (eventFull || ticketSoldOut);

      if (isWaitlist) {
        setOverlay({ phase: "registering" });
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
          setOverlay({ phase: "waitlist-complete" });
          await delay(1800);
          setOverlay(null);
          router.push(
            `/registration/${encodeURIComponent(result.confirmationCode)}`
          );
        } catch (e) {
          setOverlay(null);
          toast.error(
            e instanceof Error ? e.message : "Could not join waitlist"
          );
          throw e;
        }
        return;
      }

      if (bundle.isLive && !selectedTicket.id.startsWith("mock-")) {
        setOverlay({ phase: "registering" });
        try {
          const result = await registerAttendee({
            eventSlug: bundle.event.slug,
            ticketTypeId: selectedTicket.id as Id<"ticketTypes">,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            organization: data.organization,
            position: data.position,
            paymentCompleted: false,
          });
          if (result.outcome === "waitlisted") {
            setFormDialogOpen(false);
            setSelectedTicket(null);
            setOverlay({ phase: "waitlist-complete" });
            await delay(1800);
            setOverlay(null);
            router.push(
              `/registration/${encodeURIComponent(result.confirmationCode)}`
            );
            return;
          }
          const saved = savePendingRegistration(
            bundle.event.slug,
            selectedTicket,
            data,
            bundle.isLive,
            result.confirmationCode
          );
          setPending(saved);
          setFormDialogOpen(false);
          setOverlay({ phase: "redirecting-to-payment" });
          await delay(1600);
          setOverlay(null);
          setPaymentDialogOpen(true);
        } catch (e) {
          setOverlay(null);
          toast.error(e instanceof Error ? e.message : "Registration failed");
          throw e;
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
      setOverlay({ phase: "redirecting-to-payment" });
      await delay(1200);
      setOverlay(null);
      setPaymentDialogOpen(true);
    },
    [bundle, registerAttendee, router, selectedTicket]
  );

  const handlePaymentComplete = useCallback(
    async (registration: PendingRegistration, payment: PaymentData) => {
      if (
        bundle?.isLive &&
        !registration.ticketTypeId.startsWith("mock-") &&
        registration.confirmationCode
      ) {
        setPaymentDialogOpen(false);
        setOverlay({ phase: "processing-payment" });
        try {
          await confirmPayment({
            confirmationCode: registration.confirmationCode,
            amount: registration.price,
            currency: registration.currency,
            method: payment.paymentMethod,
            provider: "mock",
          });
          clearPendingRegistration();
          setSelectedTicket(null);
          setPending(null);
          setOverlay({
            phase: "payment-success",
            confirmationCode: registration.confirmationCode,
          });
          await delay(3200);
          setOverlay(null);
          router.push(
            `/registration/${encodeURIComponent(registration.confirmationCode)}`
          );
        } catch (e) {
          setOverlay(null);
          toast.error(e instanceof Error ? e.message : "Payment failed");
          throw e;
        }
        return;
      }

      setOverlay({ phase: "processing-payment" });
      await delay(800);
      clearPendingRegistration();
      setPaymentDialogOpen(false);
      setSelectedTicket(null);
      setPending(null);
      setOverlay({
        phase: "payment-success",
        confirmationCode: registration.confirmationCode,
      });
      await delay(2800);
      setOverlay(null);
      router.push("/");
    },
    [bundle?.isLive, confirmPayment, router]
  );

  const allTicketTypesSoldOut = useMemo(
    () => allActiveTicketTypesSoldOut(bundle),
    [bundle]
  );

  const value = useMemo(
    () => ({
      openRegistration,
      bundle,
      isLoading,
      allTicketTypesSoldOut,
    }),
    [openRegistration, bundle, isLoading, allTicketTypesSoldOut]
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
          onBack={handleFormBack}
          initialData={
            pending
              ? {
                  fullName: pending.fullName,
                  email: pending.email,
                  phone: pending.phone,
                  organization: pending.organization,
                  position: pending.position,
                  ticketTypeId: pending.ticketTypeId,
                }
              : undefined
          }
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
          onBack={handlePaymentBack}
          onComplete={(payment) => handlePaymentComplete(pending, payment)}
        />
      ) : null}

      <RegistrationFlowOverlay state={overlay} />
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
