import dotenv from "dotenv";
import path from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api";

// Load .env.local so E2E_* credentials and NEXT_PUBLIC_CONVEX_URL are available
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

export default async function globalSetup() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    console.warn("[global.setup] NEXT_PUBLIC_CONVEX_URL not set — skipping E2E data cleanup");
    return;
  }

  const client = new ConvexHttpClient(convexUrl);

  try {
    const result = await client.mutation(api.e2e.cleanupE2EData, {});
    console.log("[global.setup] E2E data cleanup:", result);
  } catch (err) {
    // cleanupE2EData throws if IS_E2E !== "true" in the deployment.
    // Log a warning but don't fail the test run.
    console.warn(
      "[global.setup] cleanupE2EData skipped or failed:",
      err instanceof Error ? err.message : err
    );
  }

  try {
    await client.mutation(api.seed.ensureTestCompanyVerified, {});
    console.log("[global.setup] ensureTestCompanyVerified: done");
  } catch (err) {
    console.warn(
      "[global.setup] ensureTestCompanyVerified failed:",
      err instanceof Error ? err.message : err
    );
  }
}
