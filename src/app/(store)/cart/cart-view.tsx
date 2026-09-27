"use client";

import Link from "next/link";
import { CartLineItem } from "@/components/checkout/cart-line-item";
import { FreeShippingMeter } from "@/components/checkout/free-shipping-meter";
import { SummaryCard, SummaryRows } from "@/components/checkout/order-summary";
import { ProductRail } from "@/components/product/product-rail";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { EmptyState, Notice, Skeleton } from "@/components/ui/misc";
import { business } from "@/config/business";
import { useCart } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/stores/persistent-store";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page pt-10 pb-20 sm:pt-14">
      <h1 className="mb-8 font-display text-5xl sm:mb-10 sm:text-6xl">Your bag</h1>
      {children}
    </div>
  );
}

export function CartView() {
  const hydrated = useHydrated();
  const { items, subtotal, shipping, total, count, hasStockIssue } = useCart();

  if (!hydrated) {
    return (
      <Shell>
        <div className="grid gap-10 lg:grid-cols-12" aria-busy="true" aria-label="Loading your bag">
          <div className="space-y-6 lg:col-span-7">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-6">
                <Skeleton className="h-44 w-36 rounded-xl" />
                <div className="flex-1 space-y-3 pt-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-80 rounded-3xl lg:col-span-5" />
        </div>
      </Shell>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <Shell>
          <EmptyState
            icon="bag"
            title="Your bag is empty"
            body="Looks like you haven't added anything yet. Start with our newest pieces."
            action={
              <>
                <ButtonLink href="/shop">Shop all</ButtonLink>
                <ButtonLink href="/wishlist" variant="outline">
                  View wishlist
                </ButtonLink>
              </>
            }
            className="pt-4 sm:pt-8"
          />
        </Shell>
        <ProductRail eyebrow="Just landed" title="New arrivals" filter="new" href="/shop?filter=new" />
      </>
    );
  }

  return (
    <Shell>
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <FreeShippingMeter subtotal={subtotal} />
          <ul className="mt-2 divide-y divide-line border-b border-line">
            {items.map((item) => (
              <CartLineItem key={item.key} item={item} />
            ))}
          </ul>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline hover:underline-offset-4"
          >
            <Icon name="arrow-left" size={16} /> Continue shopping
          </Link>
        </div>

        <div className="lg:sticky lg:top-28 lg:col-span-5">
          <SummaryCard title="Order summary">
            <SummaryRows subtotal={subtotal} shipping={shipping} total={total} itemCount={count} />
            {hasStockIssue && (
              <Notice tone="danger" icon="alert" className="mt-5">
                Some items in your bag exceed available stock. Adjust them to continue.
              </Notice>
            )}
            <ButtonLink
              href="/checkout"
              size="lg"
              className={hasStockIssue ? "pointer-events-none mt-6 w-full opacity-45" : "mt-6 w-full"}
              aria-disabled={hasStockIssue || undefined}
            >
              <Icon name="lock" size={17} /> Secure checkout
            </ButtonLink>
            <p className="mt-4 text-center text-[13px] text-muted">{business.shipping.estimate}</p>
            <ul className="mt-6 space-y-3 border-t border-line pt-6 text-[13px] text-muted">
              {business.promises.map((p) => (
                <li key={p.title} className="flex gap-3">
                  <Icon name="check" size={16} className="mt-0.5 shrink-0 text-success" />
                  <span>
                    <span className="font-medium text-ink-soft">{p.title}</span> — {p.body}
                  </span>
                </li>
              ))}
            </ul>
          </SummaryCard>
        </div>
      </div>
    </Shell>
  );
}
