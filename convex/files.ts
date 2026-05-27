import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { canManageEvents, requireAuth } from "./lib/rbac";

/** Public upload for student ID during self-registration. */
export const generateStudentIdUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const generateUploadUrl = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx, args.sessionToken);
    if (!canManageEvents(user.role)) {
      throw new Error("Forbidden");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const getUrl = query({
  args: {
    sessionToken: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx, args.sessionToken);
    return await ctx.storage.getUrl(args.storageId);
  },
});
