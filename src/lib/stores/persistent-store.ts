"use client";

import { useSyncExternalStore } from "react";

/**
 * A tiny localStorage-backed store for client state (cart, wishlist, demo
 * orders…). Renders `initial` on the server and during hydration, then the
 * persisted value — so there are no hydration mismatches. Syncs across tabs.
 */
export function createPersistentStore<T>(key: string, initial: T) {
  let state = initial;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) state = JSON.parse(raw) as T;
    } catch {
      // Corrupt or inaccessible storage: fall back to the initial value.
    }
  }

  function emit() {
    listeners.forEach((listener) => listener());
  }

  function onStorage(event: StorageEvent) {
    if (event.key !== key) return;
    loaded = false;
    load();
    emit();
  }

  const store = {
    get(): T {
      load();
      return state;
    },
    set(next: T | ((prev: T) => T)) {
      load();
      state = typeof next === "function" ? (next as (prev: T) => T)(state) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        // Storage full or disabled — keep the in-memory state.
      }
      emit();
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) window.removeEventListener("storage", onStorage);
      };
    },
    use(): T {
      return useSyncExternalStore(store.subscribe, store.get, () => initial);
    },
  };
  return store;
}

const noopSubscribe = () => () => {};

/** `false` on the server and during hydration, `true` afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
