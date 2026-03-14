# prodstack — Agent Instructions

This file provides guidance to Claude Code when working with this repository.

## Quick Reference

```bash
pnpm dev              # Next.js on :3333
pnpm dev:convex       # Convex dev server (separate terminal)
pnpm test             # Vitest unit tests (convex + frontend)
pnpm e2e              # Playwright E2E tests
pnpm build            # Production build
pnpm typecheck        # TypeScript check
pnpm lint             # ESLint
pnpm create-test-users  # Create admin + regular test users
```

## MCP Servers

prodstack ships with 4 pre-configured MCP servers in `.mcp.json`:

| MCP    | Purpose                               |
| ------ | ------------------------------------- |
| shadcn | Browse + install components via AI    |
| convex | Introspect schema + functions         |
| figma  | Read Figma designs, translate to code |
| linear | Create/update issues, projects, PRDs  |

**Linear native HTTP transport (better performance for Claude Code):**

```bash
claude mcp add --transport http linear-server https://mcp.linear.app/mcp
```

## Stack

| Layer       | Technology                  |
| ----------- | --------------------------- |
| Framework   | Next.js 15 App Router       |
| Backend+DB  | Convex 1.x                  |
| Auth        | @convex-dev/auth (Password) |
| Styling     | Tailwind CSS 4 + shadcn/ui  |
| Email       | Resend + React Email        |
| Tests       | Vitest + Playwright         |
| Package mgr | pnpm                        |

## Provider Nesting (app/layout.tsx)

```
ThemeProvider
  └── ConvexAuthNextjsServerProvider
        └── ConvexClientProvider
              └── Toaster
                    └── {children}
```

## Auth Pattern

```typescript
// In any Convex function:
import { requireAuthUserId, requireAdminUser } from "./utils";

// Require any authenticated user:
const userId = await requireAuthUserId(ctx); // throws "Unauthorized" if not auth'd

// Require admin:
const userId = await requireAdminUser(ctx); // throws "Forbidden" if not admin
```

## Route Protection

Routes are defined in `utils/constants.ts`.

To add a protected route:

1. Add to `protectedRoutes` in `utils/constants.ts`
2. Create `app/(authenticated)/<route>/page.tsx`
3. Middleware automatically protects it — no changes needed

## Adding a Convex Table

1. Add table to `convex/schema.ts` with `userId: v.id("users")` and `by_user_id` index
2. Create `convex/<tableName>.ts`
3. Use `requireAuthUserId(ctx)` and filter by `userId`
4. See `convex/users.ts` as the reference implementation

## Sending Email

```typescript
// In any Convex action:
import { api } from "./_generated/api";

await ctx.runAction(api.email.sendEmail, {
  to: "user@example.com",
  subject: "Welcome",
  html: "<p>Hello!</p>",
});
```

See `docs/email.md` for Resend setup and template instructions.

## Theming

3 presets: `neutral` (default), `ocean`, `forest`.
Set via `data-theme` on `<html>`. Light/dark/system via ThemeToggle + next-themes.
CSS vars in `app/globals.css`.

## Environment Variables

### Convex dashboard (NOT .env.local):

- `SITE_URL` — e.g. `http://localhost:3333` for dev
- `JWT_PRIVATE_KEY` — Ed25519 private key
- `JWKS` — corresponding public key set
- `RESEND_API_KEY` — for transactional email

Run to set all auth vars automatically:

```bash
npx @convex-dev/auth --web-server-url http://localhost:3333
```

### .env.local:

- `NEXT_PUBLIC_CONVEX_URL` — from Convex dashboard
- `FIGMA_API_TOKEN` — optional, for Figma MCP

## Test Users

| Email                    | Password       | Role    |
| ------------------------ | -------------- | ------- |
| admin@test.prodstack.dev | TestPassword1! | Admin   |
| user@test.prodstack.dev  | TestPassword1! | Regular |

Recreate: `pnpm create-test-users`

## Common Commands

```bash
pnpm convex:codegen     # Regenerate Convex types after schema changes
pnpm convex:deploy      # Deploy Convex to production (always after convex/ changes)
pnpm test:convex        # Convex unit tests only
pnpm test:ui            # Frontend component tests only
pnpm e2e:headed         # E2E in visible browser
pnpm e2e:ui             # Playwright UI mode
```

## Agent Behavior

- Always ask clarifying questions before starting implementation.
- Run `pnpm typecheck && pnpm test && pnpm build` before committing.
- Follow patterns in `convex/users.ts` and `app/(authenticated)/settings/`.
- Use shadcn MCP to add UI components rather than writing from scratch.
- Use Linear MCP to create tickets/PRDs before starting new features.
