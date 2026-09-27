"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { ProductQuery, QuickFilter, SortKey } from "@/lib/catalog";

const QUICK: QuickFilter[] = ["new", "bestsellers", "sale"];
const SORTS: SortKey[] = ["featured", "newest", "price-asc", "price-desc"];

const list = (value: string | null) => (value ? value.split(",").filter(Boolean) : []);
const num = (value: string | null) => {
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export type ShopState = Required<Omit<ProductQuery, "quick">> & { quick: QuickFilter | null };

/** Shop filters live in the URL so results are shareable and survive refresh/back. */
export function useShopQuery() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const state: ShopState = useMemo(() => {
    const quick = params.get("filter") as QuickFilter | null;
    const sort = params.get("sort") as SortKey | null;
    return {
      search: params.get("q") ?? "",
      categories: list(params.get("category")),
      quick: quick && QUICK.includes(quick) ? quick : null,
      sizes: list(params.get("size")),
      minPrice: num(params.get("min")),
      maxPrice: num(params.get("max")),
      inStockOnly: params.get("stock") === "1",
      sort: sort && SORTS.includes(sort) ? sort : "featured",
    };
  }, [params]);

  const update = useCallback(
    (patch: Partial<ShopState>) => {
      const next = { ...state, ...patch };
      const qs = new URLSearchParams();
      if (next.search) qs.set("q", next.search);
      if (next.quick) qs.set("filter", next.quick);
      if (next.categories.length) qs.set("category", next.categories.join(","));
      if (next.sizes.length) qs.set("size", next.sizes.join(","));
      if (next.minPrice !== null) qs.set("min", String(next.minPrice));
      if (next.maxPrice !== null) qs.set("max", String(next.maxPrice));
      if (next.inStockOnly) qs.set("stock", "1");
      if (next.sort !== "featured") qs.set("sort", next.sort);
      const query = qs.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [state, router, pathname],
  );

  const clear = useCallback(
    () =>
      update({
        search: "",
        categories: [],
        quick: null,
        sizes: [],
        minPrice: null,
        maxPrice: null,
        inStockOnly: false,
      }),
    [update],
  );

  const activeCount =
    state.categories.length +
    state.sizes.length +
    (state.quick ? 1 : 0) +
    (state.minPrice !== null || state.maxPrice !== null ? 1 : 0) +
    (state.inStockOnly ? 1 : 0);

  return { state, update, clear, activeCount };
}
