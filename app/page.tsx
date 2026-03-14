import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "prodstack — Your SaaS, ready to ship",
  description:
    "An open-source SaaS starter kit built on Convex, Next.js 15, and shadcn/ui. Auth, admin, email, and AI-agent tooling out of the box.",
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold tracking-tight">
            prodstack
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="px-6 pb-24 pt-32 text-center">
          <div className="container mx-auto max-w-4xl">
            <Badge variant="secondary" className="mb-6">
              Open Source SaaS Starter
            </Badge>

            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
              Your SaaS, <span className="text-primary">ready to ship</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              prodstack gives you auth, admin, email, testing, and AI-agent tooling out of the box.
              Built on Convex, Next.js 15, and shadcn/ui. Start building your product, not your
              infrastructure.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/signup">Get started free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href="https://github.com/deepflow-labs/prodstack"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="px-6 pb-24">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(f => (
                <div key={f.title} className="rounded-lg border bg-card p-6">
                  <div className="mb-3 text-2xl">{f.icon}</div>
                  <h3 className="mb-2 font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>
            prodstack —{" "}
            <a
              href="https://github.com/deepflow-labs/prodstack"
              className="hover:text-foreground underline"
            >
              Open source
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "🔐",
    title: "Auth out of the box",
    description:
      "Email/password sign-in powered by @convex-dev/auth. Protected routes, session management, and password reset — all wired up.",
  },
  {
    icon: "⚡",
    title: "Real-time by default",
    description:
      "Convex replaces your API layer, ORM, and WebSocket server. Queries update live. No REST boilerplate, no SQL migrations.",
  },
  {
    icon: "🤖",
    title: "AI-agent ready",
    description:
      "shadcn MCP, Convex MCP, Figma MCP, and Linear MCP pre-configured. Claude Code, Codex, and OpenCode know your architecture.",
  },
  {
    icon: "📧",
    title: "Email included",
    description:
      "Resend + React Email for transactional email. Welcome and password-reset templates ready. Add new templates in minutes.",
  },
  {
    icon: "🛡️",
    title: "Admin panel",
    description:
      "User management UI with search, ban/unban, and role management. Protected by the isAdmin flag from day one.",
  },
  {
    icon: "🎨",
    title: "Three themes",
    description:
      "Neutral, ocean, and forest theme presets. Full light/dark/system mode. CSS variable based — swap colors in one file.",
  },
];
