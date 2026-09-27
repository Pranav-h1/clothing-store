"use client";

import { createMemoryStore } from "./memory-store";

export type ToastTone = "neutral" | "success" | "error";

export type Toast = {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  action?: { label: string; href: string };
};

export const toastStore = createMemoryStore<Toast[]>([]);
let toastId = 0;

export function toast(input: Omit<Toast, "id" | "tone"> & { tone?: ToastTone }) {
  const id = ++toastId;
  toastStore.set((list) => [...list.slice(-2), { tone: "neutral", ...input, id }]);
  window.setTimeout(() => dismissToast(id), 4200);
}

export function dismissToast(id: number) {
  toastStore.set((list) => list.filter((t) => t.id !== id));
}

/** Which overlay is open. Only one at a time keeps focus management simple. */
export type Overlay = "cart" | "menu" | "search" | null;
export const overlayStore = createMemoryStore<Overlay>(null);

export const openOverlay = (overlay: Overlay) => overlayStore.set(overlay);
export const closeOverlay = () => overlayStore.set(null);
