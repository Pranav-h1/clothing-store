import type { MetadataRoute } from "next";
import { business } from "@/config/business";

export default function robots(): MetadataRoute.Robots {
  return {
    // The demo stays out of search engines; flip `business.isDemo` when going live.
    rules: business.isDemo
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/", disallow: ["/admin", "/account", "/checkout", "/api"] },
    sitemap: `${business.seo.siteUrl}/sitemap.xml`,
  };
}
