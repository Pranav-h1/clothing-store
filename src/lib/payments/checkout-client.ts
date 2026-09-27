"use client";

import { business } from "@/config/business";

/** Client side of the payment flow. Holds no secrets — it talks to `/api/checkout`. */

export type CheckoutSession =
  | { mode: "demo"; subtotal: number; shipping: number; total: number }
  | {
      mode: "test" | "live";
      subtotal: number;
      shipping: number;
      total: number;
      keyId: string;
      gatewayOrderId: string;
      amountMinor: number;
      currency: string;
    };

export async function createCheckoutSession(payload: {
  items: { productId: string; size: string; quantity: number; unitPrice: number }[];
  customer: { name: string; email: string; phone: string };
}): Promise<CheckoutSession> {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
  return data as CheckoutSession;
}

type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = { open: () => void; on: (event: string, cb: (r: unknown) => void) => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Couldn't load the payment window. Check your connection."));
    document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay Checkout for a real (test or live) session and verifies the
 * result on the server. Resolves with the payment id, rejects on failure or
 * if the customer closes the window.
 */
export async function payWithRazorpay(
  session: Extract<CheckoutSession, { mode: "test" | "live" }>,
  customer: { name: string; email: string; phone: string },
): Promise<{ paymentId: string; gatewayOrderId: string }> {
  await loadRazorpayScript();
  const result = await new Promise<RazorpaySuccess>((resolve, reject) => {
    const checkout = new window.Razorpay!({
      key: session.keyId,
      amount: session.amountMinor,
      currency: session.currency,
      order_id: session.gatewayOrderId,
      name: business.brand.name,
      description: "Order payment",
      prefill: { name: customer.name, email: customer.email, contact: customer.phone },
      theme: { color: "#1c1917" },
      handler: resolve,
      modal: { ondismiss: () => reject(new Error("Payment was cancelled.")) },
    });
    checkout.on("payment.failed", () => reject(new Error("The payment failed. No money was taken.")));
    checkout.open();
  });

  const verify = await fetch("/api/checkout/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  });
  const data = await verify.json().catch(() => ({}));
  if (!verify.ok || !data.verified) throw new Error("We couldn't verify the payment. Please contact us.");
  return { paymentId: result.razorpay_payment_id, gatewayOrderId: result.razorpay_order_id };
}
