"use client";

import type { Address, Order } from "./types";
import { getProductsSnapshot, saveProduct } from "./stores/catalog";
import { clearCart, type ResolvedLine } from "./stores/cart";
import { newOrderId, recordOrder } from "./stores/orders";

/**
 * DEMO: records a paid order in this browser and decrements local stock.
 * PRODUCTION: the server creates the order when payment is verified
 * (see /api/checkout/verify and the Razorpay webhook) and adjusts inventory
 * in the database; the client only redirects to the confirmation page.
 */
export function placeOrder(input: {
  items: ResolvedLine[];
  customer: Order["customer"];
  shippingAddress: Address;
  subtotal: number;
  shippingFee: number;
  total: number;
  payment: Order["payment"];
}): Order {
  const order: Order = {
    id: newOrderId(),
    createdAt: new Date().toISOString(),
    status: "paid",
    customer: input.customer,
    shippingAddress: input.shippingAddress,
    items: input.items.map((i) => ({
      productId: i.productId,
      name: i.product.name,
      image: i.product.images[0].src,
      size: i.size,
      color: i.color,
      price: i.product.price,
      quantity: i.quantity,
    })),
    subtotal: input.subtotal,
    shippingFee: input.shippingFee,
    total: input.total,
    payment: input.payment,
  };

  for (const item of input.items) {
    // Re-read each time so several lines of the same product all apply.
    const product = getProductsSnapshot().find((p) => p.id === item.productId);
    if (!product) continue;
    const current = product.stock[item.size] ?? 0;
    saveProduct({ ...product, stock: { ...product.stock, [item.size]: Math.max(0, current - item.quantity) } });
  }

  recordOrder(order);
  clearCart();
  return order;
}
