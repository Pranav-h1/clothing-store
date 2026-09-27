"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { OrderStatusBadge, STATUS_LABEL } from "@/components/order-status";
import { Icon } from "@/components/ui/icon";
import { Badge, EmptyState } from "@/components/ui/misc";
import { Sheet } from "@/components/ui/sheet";
import { SmartImage } from "@/components/ui/smart-image";
import { cn, formatDate, formatPrice } from "@/lib/format";
import { ORDER_STATUSES, setOrderStatus, useOrders } from "@/lib/stores/orders";
import { toast } from "@/lib/stores/ui";
import type { OrderStatus } from "@/lib/types";

export function OrdersView() {
  const orders = useOrders();
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const statusParam = params.get("status") as OrderStatus | null;
  const status = statusParam && ORDER_STATUSES.includes(statusParam) ? statusParam : null;
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [lastOpenId, setLastOpenId] = useState<string | null>(null);
  if (openId && openId !== lastOpenId) setLastOpenId(openId);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter(
      (o) =>
        (!status || o.status === status) &&
        (!q || `${o.id} ${o.customer.name} ${o.customer.email}`.toLowerCase().includes(q)),
    );
  }, [orders, status, search]);

  const selected = orders.find((o) => o.id === lastOpenId);
  const setStatusFilter = (s: OrderStatus | null) =>
    router.replace(s ? `${pathname}?status=${s}` : pathname, { scroll: false });

  return (
    <>
      <AdminPageHeader title="Orders" description={`${orders.length} orders in total`} />

      <div className="-mx-4 mb-4 scrollbar-none overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2">
          {[null, ...ORDER_STATUSES].map((s) => {
            const count = s ? orders.filter((o) => o.status === s).length : orders.length;
            const active = status === s;
            return (
              <button
                key={s ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-full px-4 text-[13px] whitespace-nowrap transition-colors",
                  active ? "bg-ink text-paper" : "bg-sand hover:bg-sand-deep",
                )}
              >
                {s ? STATUS_LABEL[s] : "All"}
                <span className={cn("tabular-nums", active ? "text-paper/70" : "text-muted")}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <label className="relative mb-4 block">
        <span className="sr-only">Search orders</span>
        <Icon name="search" size={18} className="pointer-events-none absolute inset-y-0 left-4 my-auto text-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order number, name or email"
          className="h-11 w-full rounded-xl border border-line-strong bg-surface pr-4 pl-11 text-sm outline-none focus:border-ink"
        />
      </label>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {rows.length === 0 ? (
          <EmptyState icon="receipt" title="No orders here" body="Try another status or search term." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="border-b border-line bg-paper/60 text-[12px] text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Order
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Customer
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((o) => (
                  <tr key={o.id} className="transition-colors hover:bg-paper/60">
                    <td className="px-5 py-3.5">
                      <button type="button" onClick={() => setOpenId(o.id)} className="font-medium hover:underline">
                        {o.id}
                      </button>
                      {o.payment.mode === "demo" && !o.id.startsWith("DEMO") && (
                        <Badge tone="warning" className="ml-2">
                          Simulated
                        </Badge>
                      )}
                    </td>
                    <td className="px-3 py-3.5">
                      <p>{o.customer.name}</p>
                      <p className="text-[12px] text-muted">{o.customer.email}</p>
                    </td>
                    <td className="px-3 py-3.5 text-ink-soft">{formatDate(o.createdAt)}</td>
                    <td className="px-3 py-3.5">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right tabular-nums">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Sheet open={openId !== null} onClose={() => setOpenId(null)} title={selected ? `Order ${selected.id}` : "Order"}>
        {selected && (
          <div className="space-y-6 px-6 pb-8">
            <div>
              <label htmlFor="order-status" className="text-[13px] font-medium text-ink-soft">
                Status
              </label>
              <div className="relative mt-1.5">
                <select
                  id="order-status"
                  value={selected.status}
                  onChange={(e) => {
                    const next = e.target.value as OrderStatus;
                    setOrderStatus(selected.id, next);
                    toast({
                      tone: "success",
                      title: `Marked as ${STATUS_LABEL[next].toLowerCase()}`,
                      description: selected.id,
                    });
                  }}
                  className="h-12 w-full appearance-none rounded-xl border border-line-strong bg-surface pr-10 pl-4 text-[15px] outline-none focus:border-ink"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  size={16}
                  className="pointer-events-none absolute inset-y-0 right-4 my-auto text-muted"
                />
              </div>
              <p className="mt-2 text-[12px] text-muted">
                Placed {formatDate(selected.createdAt)} · Payment: Razorpay ({selected.payment.mode})
              </p>
            </div>

            <div className="grid gap-4 rounded-2xl bg-paper p-4 text-sm sm:grid-cols-2">
              <div>
                <p className="mb-1.5 eyebrow text-muted">Customer</p>
                <p>{selected.customer.name}</p>
                <p className="break-all text-muted">{selected.customer.email}</p>
                <p className="text-muted">{selected.customer.phone}</p>
              </div>
              <div>
                <p className="mb-1.5 eyebrow text-muted">Ship to</p>
                <address className="text-muted not-italic">
                  {selected.shippingAddress.line1}
                  {selected.shippingAddress.line2 && `, ${selected.shippingAddress.line2}`}
                  <br />
                  {selected.shippingAddress.city}, {selected.shippingAddress.region}{" "}
                  {selected.shippingAddress.postalCode}
                  <br />
                  {selected.shippingAddress.country}
                </address>
              </div>
            </div>

            <ul className="space-y-3">
              {selected.items.map((item) => (
                <li key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-3">
                  <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-sand">
                    <SmartImage src={item.image} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="block truncate font-medium">{item.name}</span>
                    <span className="text-[12px] text-muted">
                      {item.color} · {item.size} · ×{item.quantity}
                    </span>
                  </span>
                  <span className="text-sm tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <dl className="space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between text-muted">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(selected.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-muted">
                <dt>Shipping</dt>
                <dd className="tabular-nums">
                  {selected.shippingFee === 0 ? "Free" : formatPrice(selected.shippingFee)}
                </dd>
              </div>
              <div className="flex justify-between text-base font-medium">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(selected.total)}</dd>
              </div>
            </dl>
          </div>
        )}
      </Sheet>
    </>
  );
}
