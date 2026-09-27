"use client";

import { useMemo } from "react";
import { sizeStock } from "@/lib/catalog";
import { shippingFee } from "@/lib/pricing";
import type { CartLine, Product } from "@/lib/types";
import { createPersistentStore } from "./persistent-store";
import { useProducts } from "./catalog";

const cartStore = createPersistentStore<CartLine[]>("cart-v1", []);

export const lineKey = (productId: string, size: string, color: string) => `${productId}::${size}::${color}`;

export const MAX_PER_LINE = 10;

/** Adds to the cart, clamped to available stock. Returns the quantity actually added. */
export function addToCart(product: Product, size: string, color: string, quantity = 1): number {
  const key = lineKey(product.id, size, color);
  const available = Math.min(sizeStock(product, size), MAX_PER_LINE);
  let added = 0;
  cartStore.set((lines) => {
    const existing = lines.find((l) => l.key === key);
    const current = existing?.quantity ?? 0;
    const next = Math.min(current + quantity, available);
    added = next - current;
    if (added <= 0) return lines;
    if (existing) return lines.map((l) => (l.key === key ? { ...l, quantity: next } : l));
    return [...lines, { key, productId: product.id, size, color, quantity: next }];
  });
  return added;
}

export function setLineQuantity(key: string, quantity: number) {
  cartStore.set((lines) =>
    quantity <= 0
      ? lines.filter((l) => l.key !== key)
      : lines.map((l) => (l.key === key ? { ...l, quantity: Math.min(quantity, MAX_PER_LINE) } : l)),
  );
}

export function removeLine(key: string) {
  cartStore.set((lines) => lines.filter((l) => l.key !== key));
}

export function clearCart() {
  cartStore.set([]);
}

export type ResolvedLine = CartLine & { product: Product; available: number; lineTotal: number };

/** Cart lines joined with live product data. Lines whose product was removed are dropped. */
export function useCart() {
  const lines = cartStore.use();
  const products = useProducts();
  return useMemo(() => {
    const items: ResolvedLine[] = [];
    for (const line of lines) {
      const product = products.find((p) => p.id === line.productId);
      if (!product) continue;
      items.push({
        ...line,
        product,
        available: sizeStock(product, line.size),
        lineTotal: product.price * line.quantity,
      });
    }
    const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const shipping = shippingFee(subtotal);
    const hasStockIssue = items.some((i) => i.quantity > i.available);
    return { items, subtotal, count, shipping, total: subtotal + shipping, hasStockIssue };
  }, [lines, products]);
}
