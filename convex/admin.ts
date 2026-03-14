import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { requireAdminUser } from "./utils";

/**
 * List all users, cursor-paginated (25 per page).
 * Admin only.
 */
export const listUsers = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireAdminUser(ctx);
    return await ctx.db.query("users").order("desc").paginate(args.paginationOpts);
  },
});

/**
 * Ban a user by ID with a reason.
 * Admin only. Cannot ban yourself.
 */
export const banUser = mutation({
  args: { userId: v.id("users"), reason: v.string() },
  handler: async (ctx, args) => {
    const callerId = await requireAdminUser(ctx);
    if (args.userId === callerId) throw new Error("Cannot ban yourself");
    await ctx.db.patch(args.userId, {
      isBanned: true,
      bannedAt: Date.now(),
      bannedReason: args.reason,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Unban a user by ID.
 * Admin only.
 */
export const unbanUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await requireAdminUser(ctx);
    await ctx.db.patch(args.userId, {
      isBanned: false,
      bannedAt: undefined,
      bannedReason: undefined,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Toggle the isAdmin flag for a user.
 * Admin only. Cannot change your own admin status.
 */
export const toggleAdmin = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const callerId = await requireAdminUser(ctx);
    if (args.userId === callerId) throw new Error("Cannot change your own admin status");
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    await ctx.db.patch(args.userId, {
      isAdmin: !user.isAdmin,
      updatedAt: Date.now(),
    });
  },
});
