"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { IconField } from "@/components/auth/icon-field";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { formatConvexErrorMessage } from "@/lib/convex/error-message";

export function SetupPanel() {
  const router = useRouter();
  const seeded = useQuery(api.seed.isSeeded, {});
  const bootstrap = useMutation(api.seed.bootstrap);

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const platformReady = seeded?.seeded === true;

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (adminPassword !== confirmPassword) {
      toast.error("Passwords do not match");
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
      toast.error(formatConvexErrorMessage(err, "Setup failed"));
    } finally {
      setLoading(false);
    }
  }

  if (seeded === undefined) {
    return <p className="text-sm text-muted-foreground">Checking database…</p>;
  }

  return (
    <div className="space-y-4">
      {platformReady ? (
        <div
          className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm"
          role="status"
        >
          <p className="font-medium text-foreground">Platform is ready</p>
          <p className="mt-1 text-muted-foreground">
            Create another administrator account below, or{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              sign in
            </Link>{" "}
            if you already have access.
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Set up the conference platform and create the first administrator
          account.
        </p>
      )}

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

        <Button type="submit" disabled={loading} className="h-11 w-full">
          {loading
            ? "Creating account…"
            : platformReady
              ? "Create administrator"
              : "Create account & continue"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
