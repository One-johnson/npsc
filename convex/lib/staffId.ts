import type { GenericMutationCtx } from "convex/server";
import type { DataModel } from "../_generated/dataModel";

type MutationCtx = GenericMutationCtx<DataModel>;

const PREFIX = "npsc";

/** Format: `npsc` + 4 digits (e.g. npsc4827). */
export async function generateUniqueStaffId(ctx: MutationCtx): Promise<string> {
  for (let attempt = 0; attempt < 50; attempt++) {
    const digits = Math.floor(1000 + Math.random() * 9000);
    const staffId = `${PREFIX}${digits}`;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_staff_id", (q) => q.eq("staffId", staffId))
      .unique();
    if (!existing) {
      return staffId;
    }
  }
  throw new Error("Could not generate a unique staff ID. Try again.");
}

export async function ensureUserStaffId(
  ctx: MutationCtx,
  user: { _id: DataModel["users"]["document"]["_id"]; staffId?: string }
): Promise<string> {
  if (user.staffId) {
    return user.staffId;
  }
  const staffId = await generateUniqueStaffId(ctx);
  await ctx.db.patch(user._id, {
    staffId,
    updatedAt: Date.now(),
  });
  return staffId;
}

export function isStaffId(value: string): boolean {
  return /^npsc\d{4}$/i.test(value.trim());
}

export function normalizeStaffId(value: string): string {
  return value.trim().toLowerCase();
}
