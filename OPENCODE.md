# prodstack — OpenCode Setup

[OpenCode](https://opencode.ai) is an open-source AI coding agent for the terminal.
This file covers OpenCode-specific configuration for prodstack.

## Install OpenCode

```bash
curl -fsSL https://opencode.ai/install | bash
```

Or with npm/bun:

```bash
npm install -g opencode-ai
```

## MCP Configuration

prodstack ships with `.mcp.json` pre-configured with 4 MCP servers.
OpenCode reads this file automatically.

The servers work out of the box:

- **shadcn** — browse/install components
- **convex** — inspect schema/functions
- **figma** — read Figma designs (requires FIGMA_API_TOKEN in env)
- **linear** — create issues, projects, PRDs (OAuth on first use)

## Superpowers Skills

[Superpowers](https://github.com/obra/superpowers) provides reusable AI agent workflows:
brainstorming, TDD, debugging, writing plans, and more.

```bash
# Install superpowers (installs to ~/.config/opencode/skills/)
git clone https://github.com/obra/superpowers ~/.config/opencode/skills/superpowers
```

Available skills after install:

- `brainstorming` — explore intent and design before implementing
- `test-driven-development` — write tests first, then code
- `systematic-debugging` — structured bug investigation
- `writing-plans` — create detailed implementation plans
- `executing-plans` — execute plans with review checkpoints

## Architecture Context

See `CLAUDE.md` for the full architecture guide — the same patterns apply in OpenCode.

Key points:

- Backend: Convex (all data access goes through Convex queries/mutations)
- Auth: `@convex-dev/auth` — use `requireAuthUserId(ctx)` in all Convex functions
- Routes: protected routes in `utils/constants.ts`, enforced by `middleware.ts`
- Email: call `api.email.sendEmail` from Convex actions
- Theme: `data-theme` on `<html>`, CSS vars in `app/globals.css`

## Test Commands

```bash
pnpm test       # Vitest unit tests
pnpm e2e        # Playwright E2E
pnpm typecheck  # TypeScript
pnpm build      # Production build
```
