# Roadmap

prodstack ships as v1 with auth, admin, email, testing, 3 themes, and 4 MCPs.
Here's what's coming next.

## v1 — Current (Released)

- Email/password auth via @convex-dev/auth
- Protected routes + session management + password reset
- Admin panel: user list, search, ban/unban, toggle admin
- Resend + React Email (welcome + password-reset templates)
- Template landing page, dashboard shell, settings page
- 3 theme presets: neutral, ocean, forest + light/dark/system
- Vitest (Convex unit tests + React component tests)
- Playwright E2E tests (auth + admin happy paths)
- Storybook for component development
- 4 MCPs: shadcn, Convex, Figma, Linear
- CLAUDE.md, AGENTS.md, OPENCODE.md, .cursorrules

## v2 — Payments (Stripe)

- Stripe Checkout-based subscription flow
- Free tier + paid plan(s)
- Webhook handler (subscription created, updated, cancelled)
- Plan/status stored on user in Convex
- `isSubscribed`, `plan`, `stripeCustomerId` fields on users table

## v3 — Analytics (PostHog)

- PostHog integration
- Event tracking via Convex actions
- User identification on sign-in
- Page view tracking
- Feature flags support

## v4 — CLI Generator (`create-prodstack`)

- `npx create-prodstack@latest` — T3-style scaffolding CLI
- Interactive prompts: app name, features to include
- Opt-in features: email, admin, Stripe, PostHog
- Generates clean project with single initial commit

## v5 — Error Monitoring (Sentry)

- Sentry SDK integration
- Source maps for production
- Error boundary components
- Convex action error reporting

## v6 — i18n

- next-intl scaffold
- Example translation files (en, es)
- Locale switcher component
- Documented pattern for adding new languages

## v7 — Multi-tenancy

- Organization model (`orgs` table)
- Org membership + roles (owner, admin, member)
- Org-scoped data isolation pattern
- Invite flow
- Suitable for B2B SaaS products

---

Have a suggestion? Open an issue at github.com/deepflow-labs/prodstack.
