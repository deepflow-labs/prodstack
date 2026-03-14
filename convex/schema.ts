import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Destructure to get the auth support tables without the default `users`.
// We define our own `users` that merges auth-required fields + app fields.
const { users: _authUsers, ...supportTables } = authTables;

export default defineSchema({
  ...supportTables,

  /**
   * users — managed by Convex Auth. Extended with app-specific fields.
   * Auth creates the row on sign-up.
   */
  users: defineTable({
    // Convex Auth required fields
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    // App fields
    isAdmin: v.optional(v.boolean()),
    isBanned: v.optional(v.boolean()),
    bannedAt: v.optional(v.number()),
    bannedReason: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("by_is_admin", ["isAdmin"]),
});
