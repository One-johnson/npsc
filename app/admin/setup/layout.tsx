import { SessionProvider } from "@/components/auth/session-provider";

/** Setup is reachable before login; no AdminShell. */
export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
