"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { routes } from "@/utils/constants";
import { AppUserButton } from "@/components/AppUserButton";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.users.getCurrentUser);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link
            href={routes.protectedRoutes.dashboard}
            className="text-xl font-bold tracking-tight"
          >
            prodstack
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href={routes.protectedRoutes.dashboard}
              className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href={routes.protectedRoutes.settings}
              className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Settings
            </Link>
            {user?.isAdmin && (
              <Link
                href={routes.protectedRoutes.admin}
                className="px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Admin
              </Link>
            )}
            <ThemeToggle />
            <AppUserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
