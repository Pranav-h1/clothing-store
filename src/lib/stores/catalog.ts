"use client";

import { useMemo } from "react";
import { baseProducts } from "@/data/catalog";
import type { Product } from "@/lib/types";
import { createPersistentStore } from "./persistent-store";

/**
 * DEMO PERSISTENCE — admin product edits are stored in this browser only,
 * layered over the bundled catalog. In production, admin actions call an
 * authenticated API that writes to the database, and this layer is removed.
 */
type CatalogOverrides = {
  upserts: Record<string, Product>;
  deleted: string[];
};

const catalogStore = createPersistentStore<CatalogOverrides>("demo-catalog-overrides-v1", {
  upserts: {},
  deleted: [],
});

function merge(overrides: CatalogOverrides): Product[] {
  const deleted = new Set(overrides.deleted);
  const merged = baseProducts.filter((p) => !deleted.has(p.id)).map((p) => overrides.upserts[p.id] ?? p);
  const created = Object.values(overrides.upserts).filter(
    (p) => !deleted.has(p.id) && !baseProducts.some((b) => b.id === p.id),
  );
  return [...created, ...merged];
}

export function useProducts(): Product[] {
  const overrides = catalogStore.use();
  return useMemo(() => merge(overrides), [overrides]);
}

export function useProduct(slugOrId: string): Product | undefined {
  const products = useProducts();
  return products.find((p) => p.slug === slugOrId || p.id === slugOrId);
}

export function saveProduct(product: Product) {
  catalogStore.set((o) => ({
    upserts: { ...o.upserts, [product.id]: product },
    deleted: o.deleted.filter((id) => id !== product.id),
  }));
}

export function deleteProduct(id: string) {
  catalogStore.set((o) => {
    const upserts = { ...o.upserts };
    delete upserts[id];
    return { upserts, deleted: [...o.deleted, id] };
  });
}

export function updateStock(product: Product, size: string, units: number) {
  saveProduct({ ...product, stock: { ...product.stock, [size]: Math.max(0, Math.floor(units)) } });
}

export function resetCatalog() {
  catalogStore.set({ upserts: {}, deleted: [] });
}

/** Read the merged catalog outside React (e.g. while placing an order). */
export function getProductsSnapshot(): Product[] {
  return merge(catalogStore.get());
}
