import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./global.setup.ts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3333",
    trace: "retain-on-failure",
  },

  projects: [
    // Auth setup — runs first to create browser storage state
    {
      name: "auth-setup",
      testMatch: "**/auth.setup.ts",
      workers: 1,
      use: { ...devices["Desktop Chrome"] },
    },

    // Public tests — no auth required
    {
      name: "public",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: ["**/*.setup.ts"],
      testMatch: ["**/home.spec.ts", "**/auth.spec.ts"],
    },

    // Authenticated (regular user) tests
    {
      name: "authenticated",
      timeout: 60_000,
      retries: 1,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "./playwright/.auth/user.json",
      },
      dependencies: ["auth-setup"],
      testIgnore: ["**/*.setup.ts"],
      testMatch: ["**/auth-authenticated.spec.ts"],
    },

    // Admin tests (uses admin auth state)
    {
      name: "admin",
      timeout: 60_000,
      retries: 1,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "./playwright/.auth/admin.json",
      },
      dependencies: ["auth-setup"],
      testIgnore: ["**/*.setup.ts"],
      testMatch: ["**/admin.spec.ts"],
    },

    // Mobile
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 5"] },
      testIgnore: ["**/*.setup.ts"],
      testMatch: ["**/mobile.spec.ts"],
    },
    {
      name: "mobile-safari",
      retries: 1,
      use: { ...devices["iPhone 13"] },
      testIgnore: ["**/*.setup.ts"],
      testMatch: ["**/mobile.spec.ts"],
    },
  ],

  webServer: {
    command: "pnpm dev -p 3333",
    url: "http://localhost:3333",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
