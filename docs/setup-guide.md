# Setup Guide

## Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- A [Convex](https://convex.dev) account (free)
- A [Resend](https://resend.com) account (free tier is sufficient for dev)

## Step 1: Clone and install

```bash
git clone https://github.com/deepflow-labs/prodstack.git my-app
cd my-app
pnpm install
```

## Step 2: Create a Convex deployment

```bash
pnpm dev:convex
```

This will prompt you to log in to Convex and create a new deployment.
It writes `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` to `.env.local` automatically.

## Step 3: Configure @convex-dev/auth

This sets up JWT keys and the site URL in your Convex deployment.

```bash
npx @convex-dev/auth --web-server-url http://localhost:3333
```

This command writes `JWT_PRIVATE_KEY`, `JWKS`, and `SITE_URL` directly to the
Convex dashboard environment variables.

## Step 4: Add RESEND_API_KEY to Convex dashboard

1. Go to [resend.com](https://resend.com) and create an account
2. Create an API key
3. Go to your [Convex dashboard](https://dashboard.convex.dev) → your deployment → Settings → Environment Variables
4. Add `RESEND_API_KEY` with your Resend API key

Also update the `from` address in `convex/email.ts`:

```typescript
from: "Your App <noreply@yourdomain.com>",
```

## Step 5: Start dev servers

Run in two separate terminals:

```bash
# Terminal 1
pnpm dev

# Terminal 2
pnpm dev:convex
```

Open [http://localhost:3333](http://localhost:3333).

## Step 6: Create test users

```bash
pnpm create-test-users
```

Creates:

- `admin@test.prodstack.dev` / `TestPassword1!` (regular user — set isAdmin manually)
- `user@test.prodstack.dev` / `TestPassword1!` (regular user)

To make the admin user actually an admin, go to the Convex dashboard → Data → users,
find the admin user, and set `isAdmin: true`.

## Step 7: Run tests

```bash
pnpm test        # Vitest unit tests
pnpm e2e         # Playwright E2E (requires both dev servers running)
```

## Production deployment

1. Push to GitHub
2. Connect the repo to [Vercel](https://vercel.com)
3. Add `NEXT_PUBLIC_CONVEX_URL` to Vercel environment variables
4. Run: `npx @convex-dev/auth --prod` to set auth vars in production Convex deployment
5. Run: `pnpm convex:deploy` to deploy Convex functions
