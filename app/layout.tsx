import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/providers/convex-provider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "prodstack",
  description: "Your SaaS, ready to ship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" disableTransitionOnChange>
          <ConvexAuthNextjsServerProvider>
            <ConvexClientProvider>
              <Toaster />
              {children}
            </ConvexClientProvider>
          </ConvexAuthNextjsServerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
