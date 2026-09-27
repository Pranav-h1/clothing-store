"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { OrderStatusBadge, STATUS_LABEL } from "@/components/order-status";
import { ButtonLink } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { SmartImage } from "@/components/ui/smart-image";
import { LOW_STOCK_THRESHOLD, sizeStock } from "@/lib/catalog";
import { formatDate, formatPrice } from "@/lib/format";
import { useProducts } from "@/lib/stores/catalog";
import { ORDER_STATUSES, useOrders } from "@/lib/stores/orders";

const DAY = 86_400_000;

function StatTile({ label, value, note, icon }: { label: string; value: string; note: string; icon: IconName }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-center justify-between text-muted">
        <p className="text-[13px]">{label}</p>
        <Icon name={icon} size={18} />
      </div>
      <p className="mt-3 text-[1.75rem] font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-[12px] text-muted">{note}</p>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-5 sm:p-6 ${className ?? ""}`}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-base font-medium">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function AdminDashboardPage() {
  const orders = useOrders();
  const products = useProducts();
  const [now] = useState(() => Date.now());

  const stats = useMemo(() => {
    const since = now - 30 * DAY;
    const recent = orders.filter((o) => new Date(o.createdAt).getTime() >= since);
    const earning = recent.filter((o) => o.status !== "cancelled" && o.status !== "pending");
    const revenue = earning.reduce((s, o) => s + o.total, 0);

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const points = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today.getTime() - (29 - i) * DAY);
      const value = earning
        .filter((o) => {
          const d = new Date(o.createdAt);
          return (
            d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()
          );
        })
        .reduce((s, o) => s + o.total, 0);
      return { date, value };
    });

    // One row per product, listing the sizes that are low or sold out.
    const lowStock = products
      .map((product) => {
        const low = product.sizes.filter((size) => sizeStock(product, size) <= LOW_STOCK_THRESHOLD);
        const out = low.filter((size) => sizeStock(product, size) === 0);
        return { product, low, out };
      })
      .filter((r) => r.low.length > 0)
      .sort((a, b) => b.out.length - a.out.length || b.low.length - a.low.length);

    const byStatus = ORDER_STATUSES.map((s) => ({ status: s, count: orders.filter((o) => o.status === s).length }));

    return {
      revenue,
      orderCount: recent.length,
      aov: earning.length ? revenue / earning.length : 0,
      toFulfil: orders.filter((o) => o.status === "paid" || o.status === "processing").length,
      points,
      lowStock,
      byStatus,
    };
  }, [orders, products, now]);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="The last 30 days at a glance."
        action={
          <ButtonLink href="/admin/products/new" size="sm">
            <Icon name="plus" size={16} /> Add product
          </ButtonLink>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatTile label="Revenue" value={formatPrice(stats.revenue)} note="Paid orders, last 30 days" icon="card" />
        <StatTile label="Orders" value={String(stats.orderCount)} note="All statuses, last 30 days" icon="receipt" />
        <StatTile label="Average order" value={formatPrice(Math.round(stats.aov))} note="Per paid order" icon="bag" />
        <StatTile label="To fulfil" value={String(stats.toFulfil)} note="Paid or processing" icon="truck" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Daily revenue" className="lg:col-span-2">
          <RevenueChart points={stats.points} />
        </Panel>
        <Panel title="Orders by status">
          <ul className="space-y-3">
            {stats.byStatus.map(({ status, count }) => (
              <li key={status} className="flex items-center justify-between gap-3">
                <OrderStatusBadge status={status} />
                <Link
                  href={`/admin/orders?status=${status}`}
                  className="text-sm text-ink-soft tabular-nums hover:underline"
                  aria-label={`${count} ${STATUS_LABEL[status]} orders`}
                >
                  {count}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel
          title="Recent orders"
          className="lg:col-span-2"
          action={
            <Link href="/admin/orders" className="text-[13px] text-muted hover:text-ink">
              View all
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{o.customer.name}</p>
                  <p className="text-[12px] text-muted">
                    {o.id} · {formatDate(o.createdAt)}
                  </p>
                </div>
                <span className="hidden sm:block">
                  <OrderStatusBadge status={o.status} />
                </span>
                <div className="text-right">
                  <p className="text-sm tabular-nums sm:w-24">{formatPrice(o.total)}</p>
                  <p className="text-[12px] text-muted sm:hidden">{STATUS_LABEL[o.status]}</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel
          title="Low stock"
          action={
            <Link href="/admin/inventory" className="text-[13px] text-muted hover:text-ink">
              Inventory
            </Link>
          }
        >
          {stats.lowStock.length === 0 ? (
            <p className="text-sm text-muted">Everything is well stocked.</p>
          ) : (
            <ul className="space-y-3">
              {stats.lowStock.slice(0, 6).map(({ product, low, out }) => (
                <li key={product.id} className="flex items-center gap-3">
                  <span className="relative h-11 w-9 shrink-0 overflow-hidden rounded-md bg-sand">
                    <SmartImage src={product.images[0].src} alt="" fill sizes="36px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="block truncate text-[13px] font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                    <span className="block truncate text-[12px] text-muted">Sizes {low.join(", ")}</span>
                  </span>
                  <span className={`shrink-0 text-[12px] font-medium ${out.length ? "text-danger" : "text-warning"}`}>
                    {out.length === product.sizes.length ? "Sold out" : out.length ? `${out.length} out` : "Low"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
