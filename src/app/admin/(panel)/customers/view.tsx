"use client";

import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Icon } from "@/components/ui/icon";
import { EmptyState, Notice } from "@/components/ui/misc";
import { demoCustomers } from "@/data/demo/customers";
import { formatDate, formatPrice } from "@/lib/format";
import { useOrders } from "@/lib/stores/orders";

type Row = {
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  lastOrder: string | null;
  since: string;
};

export default function AdminCustomersPage() {
  const orders = useOrders();
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const map = new Map<string, Row>();
    for (const c of demoCustomers) {
      map.set(c.email, {
        name: c.name,
        email: c.email,
        phone: c.phone,
        orders: 0,
        spent: 0,
        lastOrder: null,
        since: c.joinedAt,
      });
    }
    for (const o of [...orders].reverse()) {
      const key = o.customer.email.toLowerCase();
      const row =
        map.get(key) ??
        ({
          name: o.customer.name,
          email: key,
          phone: o.customer.phone,
          orders: 0,
          spent: 0,
          lastOrder: null,
          since: o.createdAt,
        } as Row);
      row.orders += 1;
      if (o.status !== "cancelled") row.spent += o.total;
      row.lastOrder = o.createdAt;
      map.set(key, row);
    }
    const q = search.trim().toLowerCase();
    return [...map.values()]
      .filter((r) => !q || `${r.name} ${r.email}`.toLowerCase().includes(q))
      .sort((a, b) => b.spent - a.spent);
  }, [orders, search]);

  return (
    <>
      <AdminPageHeader title="Customers" description={`${rows.length} customers`} />
      <Notice tone="info" className="mb-4">
        Demo: customers are derived from sample data and orders placed in this browser. In production this list comes
        from the customer database.
      </Notice>
      <label className="relative mb-4 block">
        <span className="sr-only">Search customers</span>
        <Icon name="search" size={18} className="pointer-events-none absolute inset-y-0 left-4 my-auto text-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="h-11 w-full rounded-xl border border-line-strong bg-surface pr-4 pl-11 text-sm outline-none focus:border-ink"
        />
      </label>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {rows.length === 0 ? (
          <EmptyState icon="users" title="No customers found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="border-b border-line bg-paper/60 text-[12px] text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Customer
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Orders
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Total spent
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Last order
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Customer since
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r) => (
                  <tr key={r.email} className="hover:bg-paper/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sand text-[13px] font-medium">
                          {r.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium">{r.name}</p>
                          <p className="truncate text-[12px] text-muted">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 tabular-nums">{r.orders}</td>
                    <td className="px-3 py-3.5 tabular-nums">{formatPrice(r.spent)}</td>
                    <td className="px-3 py-3.5 text-ink-soft">{r.lastOrder ? formatDate(r.lastOrder) : "—"}</td>
                    <td className="px-5 py-3.5 text-ink-soft">{formatDate(r.since)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
