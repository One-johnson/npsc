"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRegistrationSheetLayout } from "@/hooks/use-registration-sheet-layout";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

type RegistrationModalContextValue = {
  useSheet: boolean;
};

const RegistrationModalContext =
  React.createContext<RegistrationModalContextValue>({ useSheet: false });

function useRegistrationModal() {
  return React.useContext(RegistrationModalContext);
}

type RegistrationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  /** Applied to dialog content or inner sheet scroll area */
  className?: string;
};

export function RegistrationModal({
  open,
  onOpenChange,
  children,
  className,
}: RegistrationModalProps) {
  const useSheet = useRegistrationSheetLayout();

  if (useSheet) {
    return (
      <RegistrationModalContext.Provider value={{ useSheet: true }}>
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent
            side="right"
            className={cn(
              "gap-0 p-0",
              "inset-0 h-dvh w-full max-w-none rounded-none border-0",
              "data-[side=right]:w-full data-[side=right]:max-w-none",
              "data-[side=right]:data-ending-style:translate-x-0",
              "data-[side=right]:data-starting-style:translate-x-0"
            )}
          >
            <div
              className={cn(
                "flex h-full min-h-0 flex-col overflow-y-auto",
                className
              )}
            >
              {children}
            </div>
          </SheetContent>
        </Sheet>
      </RegistrationModalContext.Provider>
    );
  }

  return (
    <RegistrationModalContext.Provider value={{ useSheet: false }}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={className}>{children}</DialogContent>
      </Dialog>
    </RegistrationModalContext.Provider>
  );
}

export function RegistrationModalHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { useSheet } = useRegistrationModal();
  const Comp = useSheet ? SheetHeader : DialogHeader;
  return (
    <Comp
      className={cn(useSheet && "shrink-0 gap-2 px-6 pb-0 pt-2 text-left", className)}
      {...props}
    />
  );
}

export function RegistrationModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) {
  const { useSheet } = useRegistrationModal();
  const Comp = useSheet ? SheetTitle : DialogTitle;
  return (
    <Comp
      className={cn(useSheet && "text-xl font-semibold", className)}
      {...props}
    />
  );
}

export function RegistrationModalDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) {
  const { useSheet } = useRegistrationModal();
  const Comp = useSheet ? SheetDescription : DialogDescription;
  return <Comp className={className} {...props} />;
}

export function RegistrationModalFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { useSheet } = useRegistrationModal();
  const Comp = useSheet ? SheetFooter : DialogFooter;
  return (
    <Comp
      className={cn(
        useSheet &&
          "shrink-0 flex-row justify-end gap-2 border-t bg-muted/50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
        className
      )}
      {...props}
    />
  );
}

export function RegistrationModalBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { useSheet } = useRegistrationModal();
  return (
    <div
      className={cn(useSheet && "flex-1 px-6 py-4", !useSheet && "contents", className)}
      {...props}
    />
  );
}

type RegistrationModalBackButtonProps = {
  onBack: () => void;
  label?: string;
};

/** Sticky back control for sheet/tablet registration steps. */
export function RegistrationModalBackButton({
  onBack,
  label = "Back",
}: RegistrationModalBackButtonProps) {
  const { useSheet } = useRegistrationModal();
  if (!useSheet) return null;

  return (
    <div className="sticky top-0 z-10 shrink-0 border-b border-border/60 bg-popover px-4 py-3">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 gap-1 text-muted-foreground"
        onClick={onBack}
      >
        <ChevronLeft className="size-4" />
        {label}
      </Button>
    </div>
  );
}
