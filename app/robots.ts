import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  const adminRoute = process.env.ADMIN_ROUTE_SECRET || "studio";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the admin panel out of search results even though it is
      // auth-protected: a crawler hitting it burns rate-limit budget on the
      // login page.
      disallow: [`/${adminRoute}/`],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
