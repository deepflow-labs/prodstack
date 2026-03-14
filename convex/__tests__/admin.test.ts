import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

// Pass modules explicitly so convex-test doesn't need to call import.meta.glob
// from inside node_modules (which may not be available in Vitest 4.x node environment)
const modules = import.meta.glob("../**/*.*s");

describe("admin", () => {
  test("listUsers throws Unauthorized for unauthenticated caller", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.query(api.admin.listUsers, { paginationOpts: { numItems: 10, cursor: null } })
    ).rejects.toThrow("Unauthorized");
  });

  test("banUser throws Forbidden for non-admin user", async () => {
    const t = convexTest(schema, modules);
    const targetId = await t.run(async ctx => {
      return ctx.db.insert("users", {
        email: "target@example.com",
        isAdmin: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    });
    await expect(
      t.mutation(api.admin.banUser, { userId: targetId, reason: "test" })
    ).rejects.toThrow();
  });

  test("toggleAdmin throws Unauthorized for unauthenticated caller", async () => {
    const t = convexTest(schema, modules);
    const userId = await t.run(async ctx => {
      return ctx.db.insert("users", { email: "u@example.com" });
    });
    await expect(t.mutation(api.admin.toggleAdmin, { userId })).rejects.toThrow("Unauthorized");
  });
});
