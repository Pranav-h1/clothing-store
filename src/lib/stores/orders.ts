"use client";

import { useMemo } from "react";
import { demoOrders } from "@/data/demo/orders";
import type { Order, OrderStatus } from "@/lib/types";
import { createPersistentStore } from "./persistent-store";

/**
 * DEMO PERSISTENCE — orders placed in this browser plus admin status changes.
 * In production orders are created server-side after payment verification
 * (and the Razorpay webhook), then read back through an authenticated API.
 */
type OrdersState = {
  placed: Order[];
  statusOverrides: Record<string, OrderStatus>;
};

const ordersStore = createPersistentStore<OrdersState>("demo-orders-v1", {
  placed: [],
  statusOverrides: {},
});

export const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

/** All orders, newest first: this browser's orders followed by the demo history. */
export function useOrders(): Order[] {
  const state = ordersStore.use();
  return useMemo(
    () =>
      [...state.placed, ...demoOrders]
        .map((o) => ({ ...o, status: state.statusOverrides[o.id] ?? o.status }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [state],
  );
}

export function recordOrder(order: Order) {
  ordersStore.set((s) => ({ ...s, placed: [order, ...s.placed] }));
}

export function setOrderStatus(id: string, status: OrderStatus) {
  ordersStore.set((s) => ({ ...s, statusOverrides: { ...s.statusOverrides, [id]: status } }));
}

export function newOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `ORD-${stamp}${rand}`;
}

export function resetOrders() {
  ordersStore.set({ placed: [], statusOverrides: {} });
}
