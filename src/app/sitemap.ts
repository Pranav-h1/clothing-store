import type { MetadataRoute } from "next";
import { business } from "@/config/business";
import { baseProducts, categories } from "@/data/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${business.seo.siteUrl}${path}`;
  return [
    ...["/", "/shop", "/collections", "/about", "/contact"].map((path) => ({ url: url(path) })),
    ...categories.map((c) => ({ url: url(`/collections/${c.slug}`) })),
    ...baseProducts.map((p) => ({ url: url(`/products/${p.slug}`), lastModified: p.createdAt })),
  ];
}
