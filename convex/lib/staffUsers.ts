import type { GenericMutationCtx } from "convex/server";
import type { DataModel } from "../_generated/dataModel";
import { hashPassword } from "./password";
import { generateUniqueStaffId } from "./staffId";

type MutationCtx = GenericMutationCtx<DataModel>;

export async function insertStaffUser(
  ctx: MutationCtx,
  args: {
    email: string;
    name: string;
    contact?: string;
    password: string;
    role: "admin" | "finance";
  }
) {
  if (args.password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const email = args.email.trim().toLowerCase();
  const existing = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", email))
    .unique();
  if (existing) {
    throw new Error("A user with this email already exists");
  }

  const now = Date.now();
  const staffId = await generateUniqueStaffId(ctx);
  const contact = args.contact?.trim() || undefined;

  const userId = await ctx.db.insert("users", {
    email,
    name: args.name.trim(),
    ...(contact ? { contact } : {}),
    staffId,
    passwordHash: hashPassword(args.password),
    role: args.role,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  return {
    userId,
    staffId,
    email,
    name: args.name.trim(),
    contact: contact ?? null,
    role: args.role,
  };
}
