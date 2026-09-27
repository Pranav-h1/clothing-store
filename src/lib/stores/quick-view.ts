"use client";

import { createMemoryStore } from "./memory-store";

/** The product currently shown in the quick-view modal, if any. */
export const quickViewStore = createMemoryStore<string | null>(null);

export const openQuickView = (productId: string) => quickViewStore.set(productId);
export const closeQuickView = () => quickViewStore.set(null);
