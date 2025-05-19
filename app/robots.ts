import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blackvault.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/admin", "/api", "/checkout", "/profile"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
