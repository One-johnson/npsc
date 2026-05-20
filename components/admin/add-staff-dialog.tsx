"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStaffSession } from "@/components/auth/session-provider";
import type { StaffRole } from "@/lib/auth/types";

const ASSIGNABLE_ROLES: {
  value: StaffRole;
  label: string;
  description: string;
}[] = [
  {
    value: "finance",
    label: "Finance",
    description: "Payments, refunds, and financial reports.",
  },
  {
    value: "checkin",
    label: "Check-in",
    description: "On-site QR scanning and attendee lookup.",
  },
];

type CreatedStaff = {
  staffId: string;
  email: string;
  name: string;
  contact: string | null;
  role: StaffRole;
};

export function AddStaffDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { sessionToken } = useStaffSession();
  const createStaff = useMutation(api.auth.createStaffUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<StaffRole>("checkin");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedStaff | null>(null);
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setName("");
    setEmail("");
    setContact("");
    setPassword("");
    setRole("checkin");
    setError(null);
    setCreated(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next) resetForm();
    onOpenChange(next);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionToken) return;
    setLoading(true);
    setError(null);
    setCreated(null);
    try {
      const result = await createStaff({
        sessionToken,
        name,
        email,
        contact: contact.trim() || undefined,
        password,
        role,
      });
      setCreated({
        staffId: result.staffId,
        email: result.email,
        name: result.name,
        contact: result.contact,
        role: result.role,
      });
      setName("");
      setEmail("");
      setContact("");
      setPassword("");
      setRole("checkin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add staff member</DialogTitle>
          <DialogDescription>
            Create a finance or check-in account. They receive a unique staff ID (
            <span className="font-mono">npsc####</span>) for sign-in.
          </DialogDescription>
        </DialogHeader>
        {created ? (
          <div
            className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm"
            role="status"
          >
            <p className="font-medium text-primary">Staff account created</p>
            <ul className="mt-2 space-y-1 font-mono text-xs">
              <li>
                <span className="text-muted-foreground">Staff ID: </span>
                {created.staffId}
              </li>
              <li>
                <span className="text-muted-foreground">Email: </span>
                {created.email}
              </li>
              {created.contact ? (
                <li>
                  <span className="text-muted-foreground">Contact: </span>
                  {created.contact}
                </li>
              ) : null}
              <li>
                <span className="text-muted-foreground">Role: </span>
                {created.role}
              </li>
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              They can sign in at /login using the staff ID or email.
            </p>
          </div>
        ) : (
          <form onSubmit={(e) => void handleCreate(e)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="staff-name">Full name</Label>
              <Input
                id="staff-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-email">Work email</Label>
              <Input
                id="staff-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-contact">Contact</Label>
              <Input
                id="staff-contact"
                type="tel"
                placeholder="Phone number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-password">Temporary password</Label>
              <Input
                id="staff-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <p className="text-xs text-muted-foreground">
                Share securely; they can change it after sign-in.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={(v) => setRole(v as StaffRole)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNABLE_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {ASSIGNABLE_ROLES.find((r) => r.value === role)?.description}
              </p>
            </div>
            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : null}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating…" : "Create account"}
              </Button>
            </DialogFooter>
          </form>
        )}
        {created ? (
          <DialogFooter>
            <Button
              onClick={() => {
                resetForm();
                handleOpenChange(false);
              }}
            >
              Done
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
