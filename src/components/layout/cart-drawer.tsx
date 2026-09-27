"use client";

import { ButtonLink } from "../ui/button";
import { EmptyState } from "../ui/misc";
import { Sheet } from "../ui/sheet";
import { CartLineItem } from "../checkout/cart-line-item";
import { FreeShippingMeter } from "../checkout/free-shipping-meter";
import { formatPrice, pluralize } from "@/lib/format";
import { useCart } from "@/lib/stores/cart";
import { closeOverlay, overlayStore } from "@/lib/stores/ui";

export function CartDrawer() {
  const overlay = overlayStore.use();
  const { items, subtotal, count, hasStockIssue } = useCart();
  const open = overlay === "cart";

  return (
    <Sheet
      open={open}
      onClose={closeOverlay}
      title={count ? `Your bag (${count})` : "Your bag"}
      side="right"
      footer={
        items.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted">Subtotal · {pluralize(count, "item")}</span>
              <span className="text-lg font-medium tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <p className="-mt-2 text-[13px] text-muted">Shipping and payment are handled at checkout.</p>
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink href="/cart" variant="outline">
                View bag
              </ButtonLink>
              <ButtonLink
                href="/checkout"
                aria-disabled={hasStockIssue || undefined}
                className={hasStockIssue ? "pointer-events-none opacity-45" : undefined}
              >
                Checkout
              </ButtonLink>
            </div>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon="bag"
          title="Your bag is empty"
          body="Pieces you add will wait for you here."
          action={
            <ButtonLink href="/shop" onClick={closeOverlay}>
              Start shopping
            </ButtonLink>
          }
        />
      ) : (
        <div className="px-6 pb-4">
          <FreeShippingMeter subtotal={subtotal} className="mb-2" />
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <CartLineItem key={item.key} item={item} compact onNavigate={closeOverlay} />
            ))}
          </ul>
        </div>
      )}
    </Sheet>
  );
}
