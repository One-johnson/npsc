import { redirect } from "next/navigation";
import { SessionProvider } from "@/components/auth/session-provider";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  getServerSessionUser,
  getSessionTokenFromCookies,
} from "@/lib/auth/session-server";
import type { StaffUser } from "@/lib/auth/types";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getSessionTokenFromCookies();
  const user = await getServerSessionUser();

  if (!token || !user) {
    redirect("/login");
  }

  const staffUser: StaffUser = {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    staffId: user.staffId ?? null,
  };

  return (
    <SessionProvider initialUser={staffUser} initialToken={token}>
      <AdminShell user={staffUser}>{children}</AdminShell>
    </SessionProvider>
  );
}
