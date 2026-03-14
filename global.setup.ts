import dotenv from "dotenv";
import path from "node:path";

// Load .env.local so E2E_* credentials and NEXT_PUBLIC_CONVEX_URL are available
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Global setup runs once before all Playwright tests.
// Add any one-time setup here (e.g. seeding test data via HTTP API).
export default async function globalSetup() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.warn("[global.setup] NEXT_PUBLIC_CONVEX_URL not set — skipping setup");
    return;
  }
  // No-op for now. Add test data seeding here if needed.
}
