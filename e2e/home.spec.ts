import { expect, test } from "@playwright/test";

test("home page renders and has navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/prodstack/i);

  // Header nav links
  await expect(page.getByRole("link", { name: /Log in/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Get started/i }).first()).toBeVisible();
});

test("home page has hero heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Your SaaS/i })).toBeVisible();
});

test("home page has feature cards", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/Auth out of the box/i)).toBeVisible();
  await expect(page.getByText(/Real-time by default/i)).toBeVisible();
  await expect(page.getByText(/AI-agent ready/i)).toBeVisible();
});

test("home page get started link goes to signup", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Get started free/i }).click();
  await expect(page).toHaveURL(/\/signup/);
});
