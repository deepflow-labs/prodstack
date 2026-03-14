import { test, expect } from "@playwright/test";

test.describe("admin panel — admin user", () => {
  test.use({ storageState: "playwright/.auth/admin.json" });

  test("admin can view user list", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("columnheader", { name: "Email" })).toBeVisible();
  });

  test("admin can search users by email", async ({ page }) => {
    await page.goto("/admin");
    await page.getByPlaceholder(/search by email/i).fill("user@test");
    await expect(page.getByText("user@test.prodstack.dev")).toBeVisible();
  });

  test("admin can ban a user", async ({ page }) => {
    await page.goto("/admin");
    const userRow = page.getByRole("row").filter({ hasText: "user@test.prodstack.dev" });
    await userRow.getByRole("button", { name: "Ban" }).click();
    await page.getByPlaceholder(/reason for ban/i).fill("E2E test ban");
    await page.getByRole("button", { name: "Confirm ban" }).click();
    await expect(page.getByText("User banned")).toBeVisible();
    // Cleanup: unban for subsequent test runs
    await userRow.getByRole("button", { name: "Unban" }).click();
    await expect(page.getByText("User unbanned")).toBeVisible();
  });
});

test.describe("admin panel — non-admin user", () => {
  test.use({ storageState: "playwright/.auth/user.json" });

  test("non-admin is redirected away from /admin", async ({ page }) => {
    await page.goto("/admin");
    // Should redirect to login or dashboard, not stay on /admin
    await expect(page).not.toHaveURL("/admin");
  });
});
