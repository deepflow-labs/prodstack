import { expect, test } from "@playwright/test";

// Authenticated auth tests — requires auth-setup to have run first.
// These tests use the saved storage state from auth.setup.ts.

test("authenticated user stays on dashboard after reload", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });

  await page.reload();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
});
