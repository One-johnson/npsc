import { Suspense } from "react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { LoginExtras } from "@/components/auth/login-extras";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Staff sign in",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout
      title="Staff sign in"
      description="Use your staff ID (npsc####) or work email to access the operations dashboard."
    >
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <LoginForm />
      </Suspense>
      <LoginExtras />
    </AuthSplitLayout>
  );
}
