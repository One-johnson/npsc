"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { StaffUser } from "@/lib/auth/types";

type SessionContextValue = {
  user: StaffUser | null;
  sessionToken: string | null;
  isLoading: boolean;
  setSession: (session: { user: StaffUser; sessionToken: string }) => void;
  clearSession: () => void;
  refreshSession: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  children,
  initialUser,
  initialToken,
}: {
  children: ReactNode;
  initialUser?: StaffUser | null;
  initialToken?: string | null;
}) {
  const [user, setUser] = useState<StaffUser | null>(initialUser ?? null);
  const [sessionToken, setSessionToken] = useState<string | null>(
    initialToken ?? null
  );
  const [isLoading, setIsLoading] = useState(!initialUser);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/token", { credentials: "include" });
      const data = (await res.json()) as {
        token: string | null;
        user: StaffUser | null;
      };
      setSessionToken(data.token);
      setUser(data.user);
    } catch {
      setSessionToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialUser) {
      void refreshSession();
    }
  }, [initialUser, refreshSession]);

  const setSession = useCallback(
    (session: { user: StaffUser; sessionToken: string }) => {
      setUser(session.user);
      setSessionToken(session.sessionToken);
      setIsLoading(false);
    },
    []
  );

  const clearSession = useCallback(() => {
    setUser(null);
    setSessionToken(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      sessionToken,
      isLoading,
      setSession,
      clearSession,
      refreshSession,
    }),
    [user, sessionToken, isLoading, setSession, clearSession, refreshSession]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useStaffSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useStaffSession must be used within SessionProvider");
  }
  return ctx;
}

export function useSessionToken(): string | null {
  return useStaffSession().sessionToken;
}
