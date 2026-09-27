import { categories } from "@/data/catalog";
import type { Product } from "./types";

/** Pure catalog helpers — safe on server and client. */

export function totalStock(product: Product): number {
  return product.sizes.reduce((sum, size) => sum + (product.stock[size] ?? 0), 0);
}

export function sizeStock(product: Product, size: string): number {
  return product.stock[size] ?? 0;
}

export type StockLevel = "in" | "low" | "out";

export const LOW_STOCK_THRESHOLD = 3;

export function stockLevel(units: number): StockLevel {
  if (units <= 0) return "out";
  if (units <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
}

export function isOnSale(product: Product): boolean {
  return product.compareAtPrice !== null && product.compareAtPrice > product.price;
}

export function discountPercent(product: Product): number {
  if (!isOnSale(product)) return 0;
  return Math.round((1 - product.price / product.compareAtPrice!) * 100);
}

export function categoryName(slug: string): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export type QuickFilter = "new" | "bestsellers" | "sale";

export type ProductQuery = {
  search?: string;
  categories?: string[];
  quick?: QuickFilter | null;
  sizes?: string[];
  minPrice?: number | null;
  maxPrice?: number | null;
  inStockOnly?: boolean;
  sort?: SortKey;
};

export function queryProducts(products: Product[], query: ProductQuery): Product[] {
  const search = query.search?.trim().toLowerCase();
  const result = products.filter((p) => {
    if (search) {
      const haystack = `${p.name} ${p.description} ${categoryName(p.category)} ${p.colors
        .map((c) => c.name)
        .join(" ")} ${p.material}`.toLowerCase();
      if (!search.split(/\s+/).every((term) => haystack.includes(term))) return false;
    }
    if (query.categories?.length && !query.categories.includes(p.category)) return false;
    if (query.quick === "new" && !p.isNew) return false;
    if (query.quick === "bestsellers" && !p.bestseller) return false;
    if (query.quick === "sale" && !isOnSale(p)) return false;
    if (query.sizes?.length && !query.sizes.some((s) => p.sizes.includes(s) && sizeStock(p, s) > 0)) return false;
    if (query.minPrice != null && p.price < query.minPrice) return false;
    if (query.maxPrice != null && p.price > query.maxPrice) return false;
    if (query.inStockOnly && totalStock(p) === 0) return false;
    return true;
  });

  const sort = query.sort ?? "featured";
  const score = (p: Product) =>
    (p.featured ? 4 : 0) + (p.bestseller ? 2 : 0) + (p.isNew ? 1 : 0) + (totalStock(p) > 0 ? 8 : 0);
  return result.sort((a, b) => {
    switch (sort) {
      case "newest":
        return b.createdAt.localeCompare(a.createdAt);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return score(b) - score(a);
    }
  });
}

export function relatedProducts(products: Product[], product: Product, limit = 4): Product[] {
  const others = products.filter((p) => p.id !== product.id && totalStock(p) > 0);
  const sameCategory = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category && p.audience === product.audience);
  return [...sameCategory, ...rest].slice(0, limit);
}
