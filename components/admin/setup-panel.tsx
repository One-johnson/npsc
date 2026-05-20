"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Lock, Mail, User } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { IconField } from "@/components/auth/icon-field";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";

export function SetupPanel() {
  const router = useRouter();
  const seeded = useQuery(api.seed.isSeeded, {});
  const bootstrap = useMutation(api.seed.bootstrap);

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (adminPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await bootstrap({
        adminName,
        adminEmail,
        adminPassword,
      });
      router.push(
        `/login?setup=1&staffId=${encodeURIComponent(res.adminStaffId)}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  }

  if (seeded === undefined) {
    return <p className="text-sm text-muted-foreground">Checking database…</p>;
  }

  if (seeded.seeded) {
    return (
      <p className="rounded-lg border border-border bg-muted/30 p-4 text-center text-sm">
        An administrator account already exists.{" "}
        <a href="/login" className="font-medium text-primary hover:underline">
          Sign in to the dashboard
        </a>
        .
      </p>
    );
  }

  return (
    <form onSubmit={(e) => void handleRegister(e)} className="space-y-4">
      <IconField
        id="admin-name"
        label="Full name"
        icon={User}
        value={adminName}
        onChange={(e) => setAdminName(e.target.value)}
        autoComplete="name"
        placeholder="Your name"
        required
      />

      <IconField
        id="admin-email"
        label="Work email"
        icon={Mail}
        type="email"
        value={adminEmail}
        onChange={(e) => setAdminEmail(e.target.value)}
        autoComplete="email"
        placeholder="you@organization.com"
        required
      />

      <PasswordField
        id="admin-password"
        label="Password"
        icon={Lock}
        value={adminPassword}
        onChange={(e) => setAdminPassword(e.target.value)}
        autoComplete="new-password"
        minLength={8}
        placeholder="At least 8 characters"
        required
      />

      <PasswordField
        id="admin-confirm"
        label="Confirm password"
        icon={Lock}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        minLength={8}
        placeholder="Re-enter password"
        required
      />

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={loading} className="h-11 w-full">
        {loading ? "Creating account…" : "Create account & continue"}
      </Button>
    </form>
  );
}
