import { NextResponse } from "next/server";
import { business } from "@/config/business";
import { baseProducts } from "@/data/catalog";
import { shippingFee, toMinorUnits } from "@/lib/pricing";
import { createRazorpayOrder, paymentMode, publicKeyId } from "@/lib/payments/razorpay-server";
import { validateEmail, validatePhone } from "@/lib/validation";

type RequestItem = { productId: string; size: string; quantity: number; unitPrice: number };

type CheckoutRequest = {
  items: RequestItem[];
  customer: { name: string; email: string; phone: string };
};

function isValidItem(item: unknown): item is RequestItem {
  const i = item as RequestItem;
  return (
    typeof i?.productId === "string" &&
    typeof i.size === "string" &&
    Number.isInteger(i.quantity) &&
    i.quantity > 0 &&
    i.quantity <= 10 &&
    typeof i.unitPrice === "number" &&
    i.unitPrice >= 0
  );
}

/** Lets the checkout page tell customers whether payments are simulated, test or live. */
export function GET() {
  return NextResponse.json({ mode: paymentMode() });
}

/**
 * Prices the cart on the server and, when Razorpay keys are configured,
 * creates a Razorpay order for the authoritative amount.
 */
export async function POST(request: Request) {
  let body: CheckoutRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { items, customer } = body ?? {};
  if (!Array.isArray(items) || items.length === 0 || items.length > 50 || !items.every(isValidItem)) {
    return NextResponse.json({ error: "Your bag is empty or invalid." }, { status: 400 });
  }
  if (!customer || validateEmail(customer.email ?? "") || validatePhone(customer.phone ?? "")) {
    return NextResponse.json({ error: "Please check your contact details." }, { status: 400 });
  }

  const mode = paymentMode();

  // With real payments the server's catalog is the source of truth for prices
  // and stock. DEMO mode also accepts products created in the browser-only
  // admin, which the server cannot see, using the price the client sent.
  let subtotal = 0;
  for (const item of items) {
    const product = baseProducts.find((p) => p.id === item.productId);
    if (!product) {
      if (mode !== "demo") {
        return NextResponse.json({ error: "An item in your bag is no longer available." }, { status: 409 });
      }
      subtotal += item.unitPrice * item.quantity;
      continue;
    }
    if (mode !== "demo" && (product.stock[item.size] ?? 0) < item.quantity) {
      return NextResponse.json({ error: `${product.name} (${item.size}) is out of stock.` }, { status: 409 });
    }
    subtotal += product.price * item.quantity;
  }
  const shipping = shippingFee(subtotal);
  const total = subtotal + shipping;

  if (mode === "demo") {
    return NextResponse.json({ mode, subtotal, shipping, total });
  }

  try {
    const order = await createRazorpayOrder({
      amountMinor: toMinorUnits(total),
      currency: business.currency.code,
      receipt: `rcpt_${Date.now()}`,
      notes: { customer_email: customer.email },
    });
    return NextResponse.json({
      mode,
      subtotal,
      shipping,
      total,
      keyId: publicKeyId(),
      gatewayOrderId: order.id,
      amountMinor: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "We couldn't start the payment. Please try again in a moment." },
      { status: 502 },
    );
  }
}
