// test-utils/msw/handlers/users.ts
import type { Id } from "@/convex/_generated/dataModel";

export const testUser = (overrides: Record<string, unknown> = {}) => ({
  _id: "user_1" as Id<"users">,
  _creationTime: Date.now(),
  email: "user@test.prodstack.dev",
  name: "Test User",
  isAdmin: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});

export const adminUser = (overrides: Record<string, unknown> = {}) => ({
  _id: "user_admin_1" as Id<"users">,
  _creationTime: Date.now(),
  email: "admin@test.prodstack.dev",
  name: "Admin User",
  isAdmin: true,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...overrides,
});
