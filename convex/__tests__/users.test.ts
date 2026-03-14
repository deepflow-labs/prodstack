import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

// Pass modules explicitly so convex-test doesn't need to call import.meta.glob
// from inside node_modules (which may not be available in Vitest 4.x node environment)
const modules = import.meta.glob("../**/*.*s");

describe("users", () => {
  test("getCurrentUser returns null when unauthenticated", async () => {
    const t = convexTest(schema, modules);
    const result = await t.query(api.users.getCurrentUser);
    expect(result).toBeNull();
  });

  test("updateProfile throws Unauthorized when unauthenticated", async () => {
    const t = convexTest(schema, modules);
    await expect(t.mutation(api.users.updateProfile, { name: "Test" })).rejects.toThrow(
      "Unauthorized"
    );
  });

  test("deleteCurrentUser throws Unauthorized when unauthenticated", async () => {
    const t = convexTest(schema, modules);
    await expect(t.mutation(api.users.deleteCurrentUser)).rejects.toThrow("Unauthorized");
  });
});
