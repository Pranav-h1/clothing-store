import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/razorpay-server";

/**
 * Razorpay webhook endpoint — configure it in the Razorpay dashboard as
 * `https://<your-domain>/api/webhooks/razorpay` with the events
 * `payment.captured`, `payment.failed` and `refund.processed`, and set
 * RAZORPAY_WEBHOOK_SECRET.
 *
 * Webhooks are the reliable record of payment: they arrive even when the
 * customer closes the tab before the checkout callback runs.
 */
export async function POST(request: Request) {
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as { event: string };
  switch (event.event) {
    case "payment.captured":
    case "payment.failed":
    case "refund.processed":
      // Connect the order database here: look up the order by the Razorpay
      // order id and update its status idempotently.
      break;
  }
  return NextResponse.json({ received: true });
}
