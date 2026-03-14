/**
 * Creates sign-in-able test accounts in a Convex Auth deployment.
 *
 * Usage:
 *   pnpm create-test-users           # dev deployment
 *   pnpm create-test-users --prod    # prod deployment
 *
 * Creates:
 *   admin@test.prodstack.dev  / TestPassword1!  (isAdmin: true)
 *   user@test.prodstack.dev   / TestPassword1!  (regular user)
 *
 * The CONVEX_URL is read from .env.local automatically.
 * Override by passing --url https://your-deployment.convex.cloud
 */

import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const isProd = process.argv.includes("--prod");
const urlArgIndex = process.argv.indexOf("--url");
const urlArg = urlArgIndex !== -1 ? process.argv[urlArgIndex + 1] : null;

const CONVEX_URL = urlArg ?? process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Error: NEXT_PUBLIC_CONVEX_URL not found in .env.local and --url not provided");
  process.exit(1);
}

console.log(`\nCreating test users in: ${CONVEX_URL}`);
console.log(`Mode: ${isProd ? "production" : "development"}\n`);

const TEST_USERS = [
  {
    email: "admin@test.prodstack.dev",
    password: "TestPassword1!",
    isAdmin: true,
    label: "Admin",
  },
  {
    email: "user@test.prodstack.dev",
    password: "TestPassword1!",
    isAdmin: false,
    label: "Regular User",
  },
];

async function signUpUser(email: string, password: string) {
  const res = await fetch(`${CONVEX_URL}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: "password",
      params: { email, password, flow: "signUp" },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    // If user already exists, try signing in instead
    if (body.includes("already") || res.status === 409) {
      return signInUser(email, password);
    }
    throw new Error(`Sign-up failed for ${email}: ${res.status} ${body}`);
  }

  return res.json();
}

async function signInUser(email: string, password: string) {
  const res = await fetch(`${CONVEX_URL}/api/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider: "password",
      params: { email, password, flow: "signIn" },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sign-in failed for ${email}: ${res.status} ${body}`);
  }

  return res.json();
}

async function main() {
  for (const user of TEST_USERS) {
    try {
      console.log(`Creating ${user.label}: ${user.email}`);
      await signUpUser(user.email, user.password);
      console.log(`  ✓ ${user.email} created`);

      if (user.isAdmin) {
        console.log(`  ℹ  To grant admin: set isAdmin: true in the Convex dashboard`);
        console.log(`     or run a Convex mutation directly after setup.`);
      }
    } catch (err) {
      console.error(`  ✗ Failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log("\nTest users ready:");
  for (const user of TEST_USERS) {
    console.log(`  ${user.email} / ${user.password}  [${user.label}]`);
  }
  console.log("");
}

main().catch(console.error);
