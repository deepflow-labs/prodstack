import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/settings", "/admin"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_API_URL ?? "https://prodstack.dev"}/sitemap.xml`,
  };
}
