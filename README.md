# prodstack

**The SaaS starter kit for the Convex-first, AI-agent-first era.**

Auth, admin, email, testing, themes, and 4 MCP servers — all pre-configured.
Clone it, connect your Convex deployment, and start building your product.

**Live demo:** https://prodstack-iota.vercel.app

---

## Why prodstack?

Most starter kits give you a folder structure. prodstack gives you a working product foundation — auth that actually works, an admin panel on day one, email templates ready to send, and AI agent tooling so Claude Code, Codex, or OpenCode already understand your codebase.

It replaces three T3 packages with one:

| T3 Stack         | prodstack                                       |
| ---------------- | ----------------------------------------------- |
| tRPC             | Convex (real-time, type-safe, end-to-end)       |
| Prisma / Drizzle | Convex (no SQL, no migrations ever)             |
| NextAuth.js      | @convex-dev/auth (integrated with Convex)       |
| No testing       | Vitest + Playwright (built in)                  |
| No components    | shadcn/ui full suite (built in)                 |
| No email         | Resend + React Email (built in)                 |
| No admin         | User management panel (built in)                |
| No AI tooling    | 4 MCP servers + agent docs (the differentiator) |

---

## Stack

| Layer           | Technology                           |
| --------------- | ------------------------------------ |
| Framework       | Next.js 15 App Router                |
| Backend + DB    | Convex 1.x                           |
| Auth            | @convex-dev/auth (Password provider) |
| Styling         | Tailwind CSS 4 + shadcn/ui           |
| Email           | Resend + React Email                 |
| Unit tests      | Vitest (Convex + React)              |
| E2E tests       | Playwright                           |
| Components      | Storybook                            |
| Package manager | pnpm                                 |
| Hosting         | Vercel                               |

---

## What's included

### Auth

Email/password sign-in and sign-up, protected routes via middleware, session management, and password reset — all powered by `@convex-dev/auth`. No Clerk, no third-party auth service, no extra cost.

### Admin panel

`/admin` route gated by `isAdmin` flag. User table with search, ban/unban, and role toggling. Add `requireAdminUser(ctx)` to any Convex function to protect it.

### Email

`sendEmail` action in `convex/email.ts` calls Resend directly. Welcome and password-reset HTML templates in `emails/`. Drop in `@react-email/components` if you want JSX templates.

### Themes

Three pre-configured CSS variable theme presets — **neutral** (default), **ocean** (blue-teal), **forest** (green-brown) — plus full light/dark/system toggle. Swap themes by setting `data-theme` on `<html>`.

### Testing

- Vitest: two projects — Convex unit tests (`convex-test`) and React component tests (`@testing-library/react`)
- Playwright: auth and admin E2E suites with pre-configured auth state
- Storybook: component development environment

### AI agent tooling

`.mcp.json` ships with 4 MCP servers. Open the repo in Claude Code and your agent can immediately browse shadcn components, introspect the Convex schema, read Figma designs, and create Linear tickets — without leaving the terminal.

| MCP    | What it does                        | Auth               |
| ------ | ----------------------------------- | ------------------ |
| shadcn | Browse + install components via AI  | None               |
| Convex | Introspect schema + query functions | Convex account     |
| Figma  | Read designs, translate to code     | `FIGMA_API_TOKEN`  |
| Linear | Create issues, projects, PRDs, docs | OAuth on first use |

**Claude Code + Linear native transport (recommended):**

```bash
claude mcp add --transport http linear-server https://mcp.linear.app/mcp
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/deepflow-labs/prodstack.git my-app
cd my-app
pnpm install

# 2. Create a Convex deployment (logs you in, writes .env.local automatically)
npx convex dev

# 3. Set auth keys (run once per deployment, updates Convex dashboard vars)
npx @convex-dev/auth --web-server-url http://localhost:3333

# 4. Start
pnpm dev          # terminal 1 — Next.js on :3333
pnpm dev:convex   # terminal 2 — Convex

# 5. Create test users
pnpm create-test-users
```

Go to `http://localhost:3333` and sign in with `user@test.prodstack.dev` / `TestPassword1!`.

See [docs/setup-guide.md](docs/setup-guide.md) for full instructions including Resend email setup and Vercel deployment.

---

## Environment Variables

### Set in the Convex dashboard — not `.env.local`

Run `npx @convex-dev/auth` to set all three automatically:

| Variable          | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| `SITE_URL`        | App origin (e.g. `https://yourapp.vercel.app`)                  |
| `JWT_PRIVATE_KEY` | Ed25519 private key                                             |
| `JWKS`            | Corresponding public key set                                    |
| `RESEND_API_KEY`  | From [resend.com](https://resend.com) — for transactional email |

### In `.env.local`

| Variable                 | Description                           |
| ------------------------ | ------------------------------------- |
| `NEXT_PUBLIC_CONVEX_URL` | Set automatically by `npx convex dev` |
| `FIGMA_API_TOKEN`        | Optional — for Figma MCP              |

---

## Test Users

| Email                      | Password         | Role                                            |
| -------------------------- | ---------------- | ----------------------------------------------- |
| `admin@test.prodstack.dev` | `TestPassword1!` | Admin (set `isAdmin: true` in Convex dashboard) |
| `user@test.prodstack.dev`  | `TestPassword1!` | Regular user                                    |

Create/recreate: `pnpm create-test-users`

---

## Scripts

```bash
pnpm dev                     # Next.js dev server (:3333)
pnpm dev:convex              # Convex dev server
pnpm test                    # All Vitest tests
pnpm test:convex             # Convex unit tests only
pnpm test:ui                 # React component tests only
pnpm e2e                     # Playwright E2E
pnpm build                   # Production build
pnpm typecheck               # TypeScript check
pnpm lint                    # ESLint
pnpm storybook               # Storybook (:6006)
pnpm convex:deploy           # Deploy Convex functions to production
pnpm create-test-users       # Create test users (dev)
pnpm create-test-users:prod  # Create test users (prod)
```

---

## Project Structure

```
prodstack/
├── app/
│   ├── (authenticated)/
│   │   ├── admin/       # User management (isAdmin-gated)
│   │   ├── dashboard/   # Your app starts here
│   │   └── settings/    # Account settings + delete account
│   ├── login/
│   ├── signup/
│   └── page.tsx         # Template landing page
├── convex/
│   ├── admin.ts         # Admin mutations + requireAdminUser
│   ├── email.ts         # Resend sendEmail action
│   ├── schema.ts        # Users-only schema
│   ├── users.ts         # getCurrentUser, updateProfile, deleteCurrentUser
│   └── utils.ts         # requireAuthUserId, requireAdminUser
├── emails/
│   ├── welcome.tsx      # Welcome email template
│   └── password-reset.tsx
├── components/ui/       # Full shadcn/ui suite
├── docs/                # Setup, themes, email, admin, AI agents, roadmap
├── e2e/                 # Playwright specs
├── .mcp.json            # shadcn + Convex + Figma + Linear MCPs
├── CLAUDE.md            # Architecture guide for Claude Code
├── AGENTS.md            # Same — for Codex
└── OPENCODE.md          # OpenCode + superpowers setup
```

---

## Deploying to Production

```bash
# 1. Deploy Convex functions
pnpm convex:deploy

# 2. Set auth keys for your production URL
npx @convex-dev/auth --prod
# When prompted for SITE_URL, enter your Vercel URL

# 3. Deploy to Vercel
vercel --prod

# 4. Add NEXT_PUBLIC_CONVEX_URL to Vercel environment variables
vercel env add NEXT_PUBLIC_CONVEX_URL production
# Enter: https://<your-deployment>.convex.cloud
```

---

## Documentation

- [Setup Guide](docs/setup-guide.md)
- [Themes](docs/themes.md)
- [Email](docs/email.md)
- [Admin Panel](docs/admin.md)
- [AI Agents & MCPs](docs/ai-agents.md)
- [Roadmap](docs/roadmap.md)

---

## Roadmap

| Phase        | What                                                                 |
| ------------ | -------------------------------------------------------------------- |
| **v1 — now** | Auth, admin, email, 3 themes, dark mode, 4 MCPs, Vitest + Playwright |
| **v2**       | Stripe subscriptions (checkout + webhook + plan on user)             |
| **v3**       | PostHog analytics                                                    |
| **v4**       | `create-prodstack` CLI — T3-style scaffolding with opt-in features   |
| **v5**       | Sentry error monitoring                                              |
| **v6**       | next-intl i18n scaffold                                              |
| **v7**       | Multi-tenancy patterns for B2B SaaS                                  |

---

## License

MIT — use it for anything.
