"use client";

import { useState } from "react";
import { formatDate, formatPrice, pluralize } from "@/lib/format";
import type { Order } from "@/lib/types";
import { OrderProgress, OrderStatusBadge } from "../order-status";
import { Icon } from "../ui/icon";
import { SmartImage } from "../ui/smart-image";

export function OrderCard({ order, defaultOpen = false }: { order: Order; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const count = order.items.reduce((n, i) => n + i.quantity, 0);
  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-6 gap-y-3 p-5 text-left transition-colors hover:bg-paper/60 sm:p-6"
      >
        <div className="flex -space-x-3">
          {order.items.slice(0, 3).map((item) => (
            <span
              key={`${item.productId}-${item.size}`}
              className="relative h-14 w-11 overflow-hidden rounded-lg border-2 border-surface bg-sand"
            >
              <SmartImage src={item.image} alt="" fill sizes="44px" className="object-cover" />
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{order.id}</p>
          <p className="text-[13px] text-muted">
            {formatDate(order.createdAt)} · {pluralize(count, "item")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
        <p className="w-24 text-right text-[15px] font-medium tabular-nums">{formatPrice(order.total)}</p>
        <Icon name="chevron-down" size={18} className={`text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="animate-fade-in border-t border-line p-5 sm:p-6">
          <OrderProgress status={order.status} />
          <ul className="mt-6 space-y-3">
            {order.items.map((item) => (
              <li
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="min-w-0 truncate">
                  {item.name}{" "}
                  <span className="text-muted">
                    · {item.size} · ×{item.quantity}
                  </span>
                </span>
                <span className="tabular-nums">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-line pt-4 text-sm">
            <p className="flex justify-between text-muted">
              <span>Shipping</span>
              <span className="tabular-nums">{order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}</span>
            </p>
            <p className="flex justify-between font-medium">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(order.total)}</span>
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
