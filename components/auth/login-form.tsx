"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IdCard, Lock } from "lucide-react";
import { toast } from "sonner";
import { IconField } from "@/components/auth/icon-field";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { useStaffSession } from "@/components/auth/session-provider";
import { parseJsonResponse } from "@/lib/http/parse-json-response";
import type { StaffUser } from "@/lib/auth/types";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useStaffSession();
  const setupComplete = searchParams.get("setup") === "1";
  const staffIdFromSetup = searchParams.get("staffId");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staffIdFromSetup) {
      setIdentifier(staffIdFromSetup);
    }
  }, [staffIdFromSetup]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: identifier, password }),
      });
      const data = await parseJsonResponse<{
        error?: string;
        user: StaffUser;
        sessionToken: string;
      }>(res);
      if (!res.ok) {
        toast.error(data?.error ?? "Login failed");
        return;
      }
      if (!data?.user || !data.sessionToken) {
        toast.error("Invalid response from server. Try again.");
        return;
      }
      setSession({
        user: data.user,
        sessionToken: data.sessionToken,
      });
      const next = searchParams.get("next") ?? "/admin/dashboard";
      router.push(next);
      router.refresh();
    } catch {
      toast.error("Unable to connect. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {setupComplete ? (
        <div
          className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm"
          role="status"
        >
          <p className="font-medium text-primary">Account created</p>
          <p className="mt-1 text-muted-foreground">
            Sign in with the password you just set.
            {staffIdFromSetup ? (
              <>
                {" "}
                Staff ID:{" "}
                <span className="font-mono font-medium text-foreground">
                  {staffIdFromSetup}
                </span>
              </>
            ) : null}
          </p>
        </div>
      ) : null}

      <IconField
        id="identifier"
        label="Staff ID or email"
        icon={IdCard}
        type="text"
        autoComplete="username"
        placeholder="npsc1234 or you@company.com"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />

      <PasswordField
        id="password"
        label="Password"
        icon={Lock}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        placeholder="Enter your password"
        required
      />

      <Button type="submit" className="h-11 w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
