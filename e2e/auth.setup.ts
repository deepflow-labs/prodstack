import fs from "node:fs/promises";
import path from "node:path";
import { expect, test as setup } from "@playwright/test";

const ADMIN_EMAIL = "admin@test.prodstack.dev";
const ADMIN_PASSWORD = "TestPassword1!";
const USER_EMAIL = "user@test.prodstack.dev";
const USER_PASSWORD = "TestPassword1!";

const adminAuthFile = path.resolve(process.cwd(), "playwright/.auth/admin.json");
const userAuthFile = path.resolve(process.cwd(), "playwright/.auth/user.json");

setup.describe.configure({ mode: "serial" });

setup("authenticate as admin", async ({ page }) => {
  setup.setTimeout(60_000);

  await page.goto("/login");
  await expect(page.getByRole("button", { name: /sign in/i })).toBeEnabled({ timeout: 15_000 });

  await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible({ timeout: 10_000 });

  await fs.mkdir(path.dirname(adminAuthFile), { recursive: true });
  await page.context().storageState({ path: adminAuthFile });
});

setup("authenticate as user", async ({ page }) => {
  setup.setTimeout(60_000);

  await page.goto("/login");
  await expect(page.getByRole("button", { name: /sign in/i })).toBeEnabled({ timeout: 15_000 });

  await page.getByLabel(/email/i).fill(USER_EMAIL);
  await page.getByLabel(/password/i).fill(USER_PASSWORD);
  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { name: /dashboard/i })).toBeVisible({ timeout: 10_000 });

  await fs.mkdir(path.dirname(userAuthFile), { recursive: true });
  await page.context().storageState({ path: userAuthFile });
});
