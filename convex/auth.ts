import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { hashPassword, verifyPassword } from "./lib/password";
import {
  createSession,
  deleteAllUserSessions,
  deleteSessionByToken,
  generateSessionToken,
} from "./lib/session";
import { getAuthUser, requireAuth, requireRole } from "./lib/rbac";
import {
  ensureUserStaffId,
  isStaffId,
  normalizeStaffId,
} from "./lib/staffId";
import { insertStaffUser } from "./lib/staffUsers";
import { userRoleValidator } from "./schema";

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    userAgent: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identifier = args.email.trim();
    const user = isStaffId(identifier)
      ? await ctx.db
          .query("users")
          .withIndex("by_staff_id", (q) =>
            q.eq("staffId", normalizeStaffId(identifier))
          )
          .unique()
      : await ctx.db
          .query("users")
          .withIndex("by_email", (q) => q.eq("email", identifier.toLowerCase()))
          .unique();

    if (!user || !user.isActive) {
      throw new Error("Invalid staff ID, email, or password");
    }

    const valid = verifyPassword(args.password, user.passwordHash);
    if (!valid) {
      throw new Error("Invalid staff ID, email, or password");
    }

    const staffId = await ensureUserStaffId(ctx, user);

    const sessionToken = generateSessionToken();
    await createSession(ctx, {
      userId: user._id,
      sessionToken,
      userAgent: args.userAgent,
      ipAddress: args.ipAddress,
    });

    return {
      sessionToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        staffId,
      },
    };
  },
});

export const logout = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await deleteSessionByToken(ctx, args.sessionToken);
    return { ok: true };
  },
});

export const validateSession = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    return await getAuthUser(ctx, args.sessionToken);
  },
});

export const getCurrentUser = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    return await getAuthUser(ctx, args.sessionToken);
  },
});

export const listStaff = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await requireRole(ctx, args.sessionToken, ["admin"]);
    const users = await ctx.db.query("users").collect();
    return users
      .map((u) => ({
        _id: u._id,
        staffId: u.staffId ?? null,
        email: u.email,
        name: u.name,
        contact: u.contact ?? null,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
      }))
      .sort((a, b) =>
        (a.staffId ?? a.email).localeCompare(b.staffId ?? b.email)
      );
  },
});

export const createStaffUser = mutation({
  args: {
    sessionToken: v.string(),
    email: v.string(),
    name: v.string(),
    contact: v.optional(v.string()),
    password: v.string(),
    role: userRoleValidator,
  },
  handler: async (ctx, args) => {
    await requireRole(ctx, args.sessionToken, ["admin"]);
    if (args.role === "admin") {
      throw new Error(
        "Additional admin accounts cannot be created here. Use platform setup."
      );
    }
    return await insertStaffUser(ctx, {
      email: args.email,
      name: args.name,
      contact: args.contact,
      password: args.password,
      role: args.role,
    });
  },
});

export const updateStaffUser = mutation({
  args: {
    sessionToken: v.string(),
    userId: v.id("users"),
    name: v.optional(v.string()),
    contact: v.optional(v.string()),
    role: v.optional(userRoleValidator),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const admin = await requireRole(ctx, args.sessionToken, ["admin"]);
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user._id === admin._id && args.isActive === false) {
      throw new Error("You cannot deactivate your own account");
    }
    if (args.role !== undefined) {
      if (args.role === "admin") {
        throw new Error("Admin role cannot be assigned here");
      }
      if (user.role === "admin") {
        throw new Error("Admin role cannot be changed");
      }
    }
    const contact =
      args.contact !== undefined ? args.contact.trim() || undefined : undefined;
    await ctx.db.patch(args.userId, {
      ...(args.name !== undefined ? { name: args.name.trim() } : {}),
      ...(args.contact !== undefined ? { contact } : {}),
      ...(args.role !== undefined ? { role: args.role } : {}),
      ...(args.isActive !== undefined ? { isActive: args.isActive } : {}),
      updatedAt: Date.now(),
    });
  },
});

export const bulkDeleteStaff = mutation({
  args: {
    sessionToken: v.string(),
    userIds: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const admin = await requireRole(ctx, args.sessionToken, ["admin"]);
    if (args.userIds.length === 0) {
      return { deleted: 0, skipped: 0 };
    }

    let deleted = 0;
    let skipped = 0;

    for (const userId of args.userIds) {
      if (userId === admin._id) {
        skipped += 1;
        continue;
      }

      const user = await ctx.db.get(userId);
      if (!user) {
        skipped += 1;
        continue;
      }

      if (user.role === "admin") {
        skipped += 1;
        continue;
      }

      await deleteAllUserSessions(ctx, userId);
      await ctx.db.delete(userId);
      deleted += 1;
    }

    return { deleted, skipped };
  },
});

/** Assigns npsc#### IDs to any staff created before staff IDs were introduced. */
/** One-time: migrate legacy `checkin` staff roles to `finance`. */
export const backfillLegacyCheckinRoles = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await requireRole(ctx, args.sessionToken, ["admin"]);
    const users = await ctx.db.query("users").collect();
    let updated = 0;
    for (const user of users) {
      if ((user.role as string) === "checkin") {
        await ctx.db.patch(user._id, {
          role: "finance",
          updatedAt: Date.now(),
        });
        updated += 1;
      }
    }
    return { updated };
  },
});

export const backfillStaffIds = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await requireRole(ctx, args.sessionToken, ["admin"]);
    const users = await ctx.db.query("users").collect();
    let updated = 0;
    for (const user of users) {
      if (!user.staffId) {
        await ensureUserStaffId(ctx, user);
        updated += 1;
      }
    }
    return { updated };
  },
});

export const changePassword = mutation({
  args: {
    sessionToken: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await requireAuth(ctx, args.sessionToken);
    const user = await ctx.db.get(authUser._id);
    if (!user) {
      throw new Error("User not found");
    }
    const valid = verifyPassword(args.currentPassword, user.passwordHash);
    if (!valid) {
      throw new Error("Current password is incorrect");
    }
    if (args.newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    const passwordHash = hashPassword(args.newPassword);
    await ctx.db.patch(user._id, {
      passwordHash,
      updatedAt: Date.now(),
    });
  },
});
