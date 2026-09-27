import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Razorpay server integration. Secrets are read from environment variables
 * and never leave the server (see `.env.example`).
 *
 *  • No keys configured      → "demo" mode: the checkout simulates payment.
 *  • rzp_test_… key id       → Razorpay test mode (test cards / UPI).
 *  • rzp_live_… key id       → live payments.
 */

export type PaymentMode = "demo" | "test" | "live";

function credentials() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  return keyId && keySecret ? { keyId, keySecret } : null;
}

export function paymentMode(): PaymentMode {
  const creds = credentials();
  if (!creds) return "demo";
  return creds.keyId.startsWith("rzp_live_") ? "live" : "test";
}

/** The key id is public by design (Razorpay Checkout needs it); the secret is not. */
export function publicKeyId(): string | null {
  return credentials()?.keyId ?? null;
}

export async function createRazorpayOrder(input: {
  amountMinor: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string }> {
  const creds = credentials();
  if (!creds) throw new Error("Razorpay is not configured.");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({
      amount: input.amountMinor,
      currency: input.currency,
      receipt: input.receipt,
      notes: input.notes,
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Razorpay order creation failed (${response.status}): ${detail}`);
  }
  return response.json();
}

function safeEqualHex(a: string, b: string) {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Verifies the signature Razorpay Checkout returns after a successful payment. */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  const creds = credentials();
  if (!creds) return false;
  const expected = createHmac("sha256", creds.keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqualHex(expected, signature);
}

/** Verifies `X-Razorpay-Signature` on webhook deliveries. */
export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}
