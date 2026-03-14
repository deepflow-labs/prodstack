/**
 * Mobile layout tests — run against Pixel 5 (Android Chrome) and iPhone 13 (Safari).
 * These verify that core pages remain functional and legible at mobile viewport sizes.
 */
import { expect, test } from "@playwright/test";

test.describe("Mobile — home page", () => {
  test("hero heading and CTAs are visible", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/prodstack/i);
    await expect(page.getByRole("heading", { name: /Your SaaS/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Get started free/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Log in/i })).toBeVisible();
  });

  test("feature cards are visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Auth out of the box/i)).toBeVisible();
    await expect(page.getByText(/Real-time by default/i)).toBeVisible();
  });
});

test.describe("Mobile — signup page", () => {
  test("signup page renders account creation form", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /Create your account/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });
});

test.describe("Mobile — login page", () => {
  test("login page renders sign-in form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /Sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });
});
