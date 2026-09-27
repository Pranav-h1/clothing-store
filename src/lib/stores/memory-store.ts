"use client";

import { useSyncExternalStore } from "react";

/** In-memory client store for transient UI state (drawers, toasts). */
export function createMemoryStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<() => void>();
  const store = {
    get: () => state,
    set(next: T | ((prev: T) => T)) {
      state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      listeners.forEach((l) => l());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
    use(): T {
      return useSyncExternalStore(store.subscribe, store.get, () => initial);
    },
  };
  return store;
}
