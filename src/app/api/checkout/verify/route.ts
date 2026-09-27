import { NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/payments/razorpay-server";

/**
 * Confirms a Razorpay Checkout payment by checking its HMAC signature.
 * Production: after verifying, persist the order as "paid" in the database
 * (idempotently — the webhook may arrive first) and decrement stock.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const orderId = body?.razorpay_order_id;
  const paymentId = body?.razorpay_payment_id;
  const signature = body?.razorpay_signature;

  if (typeof orderId !== "string" || typeof paymentId !== "string" || typeof signature !== "string") {
    return NextResponse.json({ verified: false, error: "Missing payment details." }, { status: 400 });
  }

  const verified = verifyPaymentSignature(orderId, paymentId, signature);
  return NextResponse.json({ verified }, { status: verified ? 200 : 400 });
}
