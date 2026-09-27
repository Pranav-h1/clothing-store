"use client";

import { createPersistentStore } from "./persistent-store";

const wishlistStore = createPersistentStore<string[]>("wishlist-v1", []);

export const useWishlist = wishlistStore.use;

/** Toggles a product and returns whether it is now saved. */
export function toggleWishlist(productId: string): boolean {
  let saved = false;
  wishlistStore.set((ids) => {
    saved = !ids.includes(productId);
    return saved ? [productId, ...ids] : ids.filter((id) => id !== productId);
  });
  return saved;
}

export function removeFromWishlist(productId: string) {
  wishlistStore.set((ids) => ids.filter((id) => id !== productId));
}
