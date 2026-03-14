import type { QueryCtx, MutationCtx, ActionCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { getAuthUserId as _getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get the authenticated user's Convex user ID.
 * Returns null if not authenticated.
 */
export async function getAuthUserId(
  ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<Id<"users"> | null> {
  return await _getAuthUserId(ctx);
}

/**
 * Require authentication and return the user ID.
 * Throws "Unauthorized" if not authenticated.
 */
export async function requireAuthUserId(
  ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

/**
 * Require that the authenticated user is an admin.
 * Throws "Unauthorized" if not authenticated, "Forbidden" if not an admin.
 */
export async function requireAdminUser(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const userId = await requireAuthUserId(ctx);
  const user = await ctx.db.get(userId);
  if (!user?.isAdmin) throw new Error("Forbidden");
  return userId;
}
