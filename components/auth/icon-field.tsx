"use client";

import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  icon: LucideIcon;
  className?: string;
} & React.ComponentProps<typeof Input>;

export function IconField({
  id,
  label,
  icon: Icon,
  className,
  ...inputProps
}: Props) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input id={id} className="h-11 pl-9" {...inputProps} />
      </div>
    </div>
  );
}
