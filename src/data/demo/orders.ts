import type { Order, OrderStatus } from "@/lib/types";
import { business } from "@/config/business";
import { demoCustomers } from "./customers";
import { demoProducts } from "./products";

/**
 * DEMO DATA — sample historical orders so the admin dashboard has content.
 * Real orders will come from the backend / payment webhook.
 */

type Spec = {
  customer: number;
  date: string;
  status: OrderStatus;
  lines: [productId: string, size: string, quantity: number][];
};

const specs: Spec[] = [
  {
    customer: 0,
    date: "2026-09-25T10:42:00Z",
    status: "paid",
    lines: [
      ["p-001", "S", 1],
      ["p-032", "M", 2],
    ],
  },
  { customer: 7, date: "2026-09-25T08:15:00Z", status: "pending", lines: [["p-018", "M", 1]] },
  {
    customer: 2,
    date: "2026-09-24T17:03:00Z",
    status: "processing",
    lines: [
      ["p-014", "S", 1],
      ["p-030", "28", 1],
    ],
  },
  { customer: 4, date: "2026-09-23T13:30:00Z", status: "shipped", lines: [["p-020", "L", 1]] },
  {
    customer: 1,
    date: "2026-09-22T09:12:00Z",
    status: "shipped",
    lines: [
      ["p-025", "M", 1],
      ["p-011", "M", 2],
    ],
  },
  {
    customer: 6,
    date: "2026-09-20T19:45:00Z",
    status: "delivered",
    lines: [
      ["p-003", "M", 1],
      ["p-008", "S", 1],
    ],
  },
  {
    customer: 3,
    date: "2026-09-18T11:20:00Z",
    status: "delivered",
    lines: [
      ["p-029", "32", 1],
      ["p-035", "L", 3],
    ],
  },
  {
    customer: 5,
    date: "2026-09-15T15:05:00Z",
    status: "delivered",
    lines: [
      ["p-039", "XL", 1],
      ["p-034", "L", 1],
    ],
  },
  { customer: 0, date: "2026-09-12T12:00:00Z", status: "cancelled", lines: [["p-004", "S", 1]] },
  { customer: 2, date: "2026-09-08T16:40:00Z", status: "delivered", lines: [["p-019", "M", 1]] },
  {
    customer: 7,
    date: "2026-09-04T10:10:00Z",
    status: "delivered",
    lines: [
      ["p-028", "S", 2],
      ["p-031", "XS", 1],
    ],
  },
  {
    customer: 4,
    date: "2026-08-29T14:22:00Z",
    status: "delivered",
    lines: [
      ["p-022", "L", 1],
      ["p-010", "L", 1],
    ],
  },
];

function shippingFor(subtotal: number) {
  const threshold = business.shipping.freeShippingThreshold;
  return threshold !== null && subtotal >= threshold ? 0 : business.shipping.flatRate;
}

export const demoOrders: Order[] = specs.map((spec, index) => {
  const customer = demoCustomers[spec.customer];
  const items = spec.lines.map(([productId, size, quantity]) => {
    const product = demoProducts.find((p) => p.id === productId)!;
    return {
      productId,
      name: product.name,
      image: product.images[0].src,
      size,
      color: product.colors[0].name,
      price: product.price,
      quantity,
    };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = shippingFor(subtotal);
  return {
    id: `DEMO-${String(1048 - index).padStart(5, "0")}`,
    createdAt: spec.date,
    status: spec.status,
    customer: { name: customer.name, email: customer.email, phone: customer.phone },
    shippingAddress: {
      fullName: customer.name,
      phone: customer.phone,
      line1: "Demo address line",
      line2: "",
      city: "City",
      region: "Region",
      postalCode: "000000",
      country: business.locale.country,
    },
    items,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    payment: { provider: "razorpay", mode: "demo" },
  };
});
