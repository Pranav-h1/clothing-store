import type { ReactNode } from "react";
import { cn, formatPrice } from "@/lib/format";

export function SummaryRows({
  subtotal,
  shipping,
  total,
  itemCount,
}: {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}) {
  return (
    <dl className="space-y-3 text-[15px]">
      <div className="flex justify-between">
        <dt className="text-muted">
          Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
        </dt>
        <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Shipping</dt>
        <dd className={cn("tabular-nums", shipping === 0 && "font-medium text-success")}>
          {shipping === 0 ? "Free" : formatPrice(shipping)}
        </dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Taxes</dt>
        <dd className="text-muted">Included where applicable</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-4">
        <dt className="font-medium">Total</dt>
        <dd className="text-xl font-medium tabular-nums">{formatPrice(total)}</dd>
      </div>
    </dl>
  );
}

export function SummaryCard({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-label={title} className={cn("rounded-3xl border border-line bg-surface p-6 sm:p-7", className)}>
      <h2 className="mb-5 font-display text-3xl">{title}</h2>
      {children}
    </section>
  );
}
