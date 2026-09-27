"use client";

import { useSearchParams } from "next/navigation";
import { OrderProgress } from "@/components/order-status";
import { SummaryRows } from "@/components/checkout/order-summary";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { EmptyState, Notice, Skeleton } from "@/components/ui/misc";
import { SmartImage } from "@/components/ui/smart-image";
import { business } from "@/config/business";
import { useCurrentUser } from "@/lib/auth/customer-auth";
import { formatDate, formatPrice } from "@/lib/format";
import { useOrders } from "@/lib/stores/orders";
import { useHydrated } from "@/lib/stores/persistent-store";

export function SuccessView() {
  const id = useSearchParams().get("order");
  const hydrated = useHydrated();
  const orders = useOrders();
  const user = useCurrentUser();
  const order = orders.find((o) => o.id === id);

  if (!hydrated) return <Skeleton className="mx-auto h-96 max-w-2xl rounded-3xl" />;

  if (!order) {
    return (
      <EmptyState
        icon="receipt"
        title="Order not found"
        body="We couldn't find that order in this browser. If you placed it, check your email for the confirmation."
        action={<ButtonLink href="/shop">Continue shopping</ButtonLink>}
      />
    );
  }

  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <span className="mx-auto flex size-16 animate-rise items-center justify-center rounded-full bg-success text-white">
          <Icon name="check" size={30} strokeWidth={2} />
        </span>
        <p className="mt-6 eyebrow text-muted">Order {order.id}</p>
        <h1 className="mt-3 font-display text-5xl leading-none sm:text-6xl">
          Thank you, {order.customer.name.split(" ")[0]}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          Your order is confirmed. A confirmation will be sent to{" "}
          <strong className="font-medium text-ink">{order.customer.email}</strong>.
        </p>
      </div>

      {order.payment.mode === "demo" && (
        <Notice tone="warning" className="mt-8" title="Demo order">
          This order was placed with a simulated payment and exists only in this browser. No email was sent and no money
          moved.
        </Notice>
      )}

      <div className="mt-8 rounded-3xl border border-line bg-surface p-6 sm:p-8">
        <OrderProgress status={order.status} />

        <ul className="mt-8 space-y-4 border-t border-line pt-6">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-sand">
                <SmartImage src={item.image} alt="" fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-[13px] text-muted">
                  {item.color} · {item.size} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm tabular-nums">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-line pt-6">
          <SummaryRows
            subtotal={order.subtotal}
            shipping={order.shippingFee}
            total={order.total}
            itemCount={itemCount}
          />
        </div>

        <div className="mt-8 grid gap-6 border-t border-line pt-6 text-sm sm:grid-cols-2">
          <div>
            <p className="mb-2 eyebrow text-muted">Shipping to</p>
            <address className="leading-relaxed text-ink-soft not-italic">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && (
                <>
                  <br />
                  {order.shippingAddress.line2}
                </>
              )}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </address>
          </div>
          <div>
            <p className="mb-2 eyebrow text-muted">Details</p>
            <p className="text-ink-soft">Placed {formatDate(order.createdAt)}</p>
            <p className="text-ink-soft">{business.shipping.estimate}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <ButtonLink href="/shop" size="lg">
          Continue shopping
        </ButtonLink>
        <ButtonLink href={user ? "/account/orders" : "/signup"} size="lg" variant="outline">
          {user ? "View my orders" : "Create an account to track orders"}
        </ButtonLink>
      </div>
    </div>
  );
}
