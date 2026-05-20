import type { Doc } from "../_generated/dataModel";
import type { GenericMutationCtx, GenericQueryCtx } from "convex/server";
import type { DataModel } from "../_generated/dataModel";

type QueryCtx = GenericQueryCtx<DataModel>;
type MutationCtx = GenericMutationCtx<DataModel>;
import { getSessionByToken } from "./session";

export type UserRole = Doc<"users">["role"];

export type AuthUser = {
  _id: Doc<"users">["_id"];
  email: string;
  name: string;
  role: UserRole;
  staffId: string | null;
};

export async function getAuthUser(
  ctx: QueryCtx | MutationCtx,
  sessionToken: string | null | undefined
): Promise<AuthUser | null> {
  if (!sessionToken) {
    return null;
  }
  const session = await getSessionByToken(ctx, sessionToken);
  if (!session) {
    return null;
  }
  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("_id"), session.userId))
    .unique();
  if (!user || !user.isActive) {
    return null;
  }
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    staffId: user.staffId ?? null,
  };
}

export async function requireAuth(
  ctx: QueryCtx | MutationCtx,
  sessionToken: string | null | undefined
): Promise<AuthUser> {
  const user = await getAuthUser(ctx, sessionToken);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(
  ctx: QueryCtx | MutationCtx,
  sessionToken: string | null | undefined,
  allowed: UserRole[]
): Promise<AuthUser> {
  const user = await requireAuth(ctx, sessionToken);
  if (!allowed.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}

export function canManageEvents(role: UserRole): boolean {
  return role === "admin";
}

export function canManageStaff(role: UserRole): boolean {
  return role === "admin";
}

export function canViewFinance(role: UserRole): boolean {
  return role === "admin" || role === "finance";
}

export function canCheckIn(role: UserRole): boolean {
  return role === "admin" || role === "checkin";
}

export function canViewRegistrations(role: UserRole): boolean {
  return role === "admin" || role === "finance" || role === "checkin";
}

export function canViewPayments(role: UserRole): boolean {
  return canViewFinance(role);
}
