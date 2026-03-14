import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId, requireAuthUserId } from "./utils";

/**
 * Get the current authenticated user record.
 * Returns null if unauthenticated.
 */
export const getCurrentUser = query({
  args: {},
  handler: async ctx => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db.get(userId);
  },
});

/**
 * Update the current user's display name.
 */
export const updateProfile = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireAuthUserId(ctx);
    await ctx.db.patch(userId, {
      name: args.name,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Hard-delete all data owned by the current user, including auth records.
 * Called from the settings page before signing the user out.
 */
export const deleteCurrentUser = mutation({
  args: {},
  handler: async ctx => {
    const userId = await requireAuthUserId(ctx);

    // Delete auth accounts and sessions so the user cannot sign back in
    const authAccounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", q => q.eq("userId", userId))
      .collect();
    await Promise.all(authAccounts.map(a => ctx.db.delete(a._id)));

    const authSessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", q => q.eq("userId", userId))
      .collect();

    const refreshTokens = (
      await Promise.all(
        authSessions.map(s =>
          ctx.db
            .query("authRefreshTokens")
            .withIndex("sessionId", q => q.eq("sessionId", s._id))
            .collect()
        )
      )
    ).flat();
    await Promise.all(refreshTokens.map(r => ctx.db.delete(r._id)));
    await Promise.all(authSessions.map(s => ctx.db.delete(s._id)));

    // Delete user row last
    await ctx.db.delete(userId);
  },
});
