# prodstack

An open-source SaaS starter kit for the Convex-first, AI-agent-first era.
Auth, admin, email, testing, and 4 MCP servers pre-configured.
Start building your product, not your infrastructure.

## Stack

| Layer       | Technology                  |
| ----------- | --------------------------- |
| Framework   | Next.js 15 App Router       |
| Backend+DB  | Convex 1.x                  |
| Auth        | @convex-dev/auth (Password) |
| Styling     | Tailwind CSS 4 + shadcn/ui  |
| Email       | Resend + React Email        |
| Unit Tests  | Vitest                      |
| E2E Tests   | Playwright                  |
| Package mgr | pnpm                        |

## What's included

- **Auth** — email/password sign-in, protected routes, password reset
- **Admin panel** — user management: list, search, ban/unban, toggle admin
- **Email** — Resend + React Email (welcome + password-reset templates)
- **3 theme presets** — neutral, ocean, forest + light/dark/system toggle
- **Testing** — Vitest (Convex unit + React component) + Playwright E2E
- **4 MCP servers** — shadcn, Convex, Figma, Linear (pre-configured in `.mcp.json`)
- **AI agent docs** — CLAUDE.md, AGENTS.md, OPENCODE.md, .cursorrules

## Quick Start

```bash
# 1. Clone
git clone https://github.com/deepflow-labs/prodstack.git my-app
cd my-app
pnpm install

# 2. Create a Convex deployment
npx convex dev  # creates a new deployment, sets CONVEX_DEPLOYMENT in .env.local

# 3. Set up auth vars (run once)
npx @convex-dev/auth --web-server-url http://localhost:3333

# 4. Add NEXT_PUBLIC_CONVEX_URL to .env.local (copy from Convex dashboard)
# Also add RESEND_API_KEY (from resend.com)

# 5. Start
pnpm dev         # terminal 1: Next.js on :3333
pnpm dev:convex  # terminal 2: Convex

# 6. Create test users
pnpm create-test-users
```

See [docs/setup-guide.md](docs/setup-guide.md) for detailed instructions.

## Environment Variables

### Set in the Convex dashboard (not .env.local):

| Variable          | Description                               |
| ----------------- | ----------------------------------------- |
| `SITE_URL`        | App origin (e.g. `http://localhost:3333`) |
| `JWT_PRIVATE_KEY` | Ed25519 private key (auto-generated)      |
| `JWKS`            | Public key set (auto-generated)           |
| `RESEND_API_KEY`  | Resend API key for email                  |

### In .env.local:

| Variable                 | Description             |
| ------------------------ | ----------------------- |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL   |
| `FIGMA_API_TOKEN`        | Optional, for Figma MCP |

## Test Users

| Email                    | Password       | Role    |
| ------------------------ | -------------- | ------- |
| admin@test.prodstack.dev | TestPassword1! | Admin   |
| user@test.prodstack.dev  | TestPassword1! | Regular |

Create/recreate: `pnpm create-test-users`

## Scripts

```bash
pnpm dev                  # Next.js dev server (:3333)
pnpm dev:convex           # Convex dev server
pnpm test                 # Vitest unit tests
pnpm test:convex          # Convex unit tests only
pnpm test:ui              # Frontend tests only
pnpm e2e                  # Playwright E2E
pnpm build                # Production build
pnpm typecheck            # TypeScript check
pnpm lint                 # ESLint
pnpm storybook            # Storybook (:6006)
pnpm convex:deploy        # Deploy Convex to production
pnpm create-test-users    # Create test users (dev)
pnpm create-test-users:prod  # Create test users (prod)
```

## MCP Servers

`.mcp.json` is pre-configured with 4 MCP servers:

| MCP    | What it does                              |
| ------ | ----------------------------------------- |
| shadcn | Browse + install components from registry |
| Convex | Introspect schema + query functions       |
| Figma  | Read Figma designs, translate to code     |
| Linear | Create issues, projects, PRDs             |

**Claude Code + Linear native transport:**

```bash
claude mcp add --transport http linear-server https://mcp.linear.app/mcp
```

## Documentation

- [Setup Guide](docs/setup-guide.md)
- [Themes](docs/themes.md)
- [Email](docs/email.md)
- [Admin Panel](docs/admin.md)
- [AI Agents & MCPs](docs/ai-agents.md)
- [Roadmap](docs/roadmap.md)

## Roadmap

| Phase | Milestone                                       |
| ----- | ----------------------------------------------- |
| v1    | Auth, admin, email, dark mode, 4 MCPs, 3 themes |
| v2    | Stripe subscriptions                            |
| v3    | PostHog analytics                               |
| v4    | `create-prodstack` CLI                          |
| v5    | Sentry monitoring                               |

## License

MIT
