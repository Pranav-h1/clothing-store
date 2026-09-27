"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/ui/misc";
import { SmartImage } from "@/components/ui/smart-image";
import { LOW_STOCK_THRESHOLD, sizeStock, stockLevel, totalStock } from "@/lib/catalog";
import { cn } from "@/lib/format";
import { updateStock, useProducts } from "@/lib/stores/catalog";
import { toast } from "@/lib/stores/ui";
import type { Product } from "@/lib/types";

type View = "all" | "low" | "out";

function StockInput({ product, size }: { product: Product; size: string }) {
  const units = sizeStock(product, size);
  const [value, setValue] = useState(String(units));
  const [synced, setSynced] = useState(units);
  if (synced !== units) {
    setSynced(units);
    setValue(String(units));
  }
  const level = stockLevel(units);

  const commit = () => {
    const next = Math.max(0, Math.floor(Number(value) || 0));
    setValue(String(next));
    if (next !== units) {
      updateStock(product, size, next);
      toast({ tone: "success", title: "Stock updated", description: `${product.name} · ${size}: ${next}` });
    }
  };

  return (
    <label className="flex flex-col items-center gap-1">
      <span className="text-[11px] font-medium text-muted">{size}</span>
      <input
        type="number"
        min={0}
        inputMode="numeric"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
        aria-label={`${product.name}, size ${size}, units in stock`}
        className={cn(
          "h-10 w-16 rounded-lg border bg-surface text-center text-sm tabular-nums outline-none focus:border-ink",
          level === "out" && "border-danger/50 bg-danger-soft text-danger",
          level === "low" && "border-warning/50 bg-warning-soft text-warning",
          level === "in" && "border-line-strong",
        )}
      />
    </label>
  );
}

export default function AdminInventoryPage() {
  const products = useProducts();
  const [view, setView] = useState<View>("all");
  const [search, setSearch] = useState("");

  const counts = useMemo(() => {
    const cells = products.flatMap((p) => p.sizes.map((s) => sizeStock(p, s)));
    return {
      units: cells.reduce((a, b) => a + b, 0),
      low: cells.filter((u) => u > 0 && u <= LOW_STOCK_THRESHOLD).length,
      out: cells.filter((u) => u === 0).length,
    };
  }, [products]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products
      .filter((p) => !q || `${p.name} ${p.sku}`.toLowerCase().includes(q))
      .filter((p) => {
        if (view === "all") return true;
        return p.sizes.some((s) => (view === "out" ? sizeStock(p, s) === 0 : stockLevel(sizeStock(p, s)) === "low"));
      });
  }, [products, view, search]);

  return (
    <>
      <AdminPageHeader title="Inventory" description="Edit stock per size. Changes save when you leave a field." />

      <div className="mb-5 grid grid-cols-3 gap-3">
        {(
          [
            ["all", "Units on hand", counts.units, "text-ink"],
            ["low", `Low (≤${LOW_STOCK_THRESHOLD})`, counts.low, "text-warning"],
            ["out", "Sold-out sizes", counts.out, "text-danger"],
          ] as const
        ).map(([key, label, value, color]) => (
          <button
            key={key}
            type="button"
            aria-pressed={view === key}
            onClick={() => setView(key)}
            className={cn(
              "rounded-2xl border bg-surface p-4 text-left transition-colors sm:p-5",
              view === key ? "border-ink" : "border-line hover:border-line-strong",
            )}
          >
            <p className="text-[12px] text-muted sm:text-[13px]">{label}</p>
            <p className={cn("mt-2 text-2xl font-semibold tabular-nums", color)}>{value}</p>
          </button>
        ))}
      </div>

      <label className="relative mb-4 block">
        <span className="sr-only">Search inventory</span>
        <Icon name="search" size={18} className="pointer-events-none absolute inset-y-0 left-4 my-auto text-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product or SKU"
          className="h-11 w-full rounded-xl border border-line-strong bg-surface pr-4 pl-11 text-sm outline-none focus:border-ink"
        />
      </label>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState icon="grid" title="Nothing to show" body="No products match this view." />
        </div>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {rows.map((p) => (
            <li key={p.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:px-5">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-sand">
                  <SmartImage src={p.images[0].src} alt="" fill sizes="44px" className="object-cover" />
                </span>
                <div className="min-w-0">
                  <Link href={`/admin/products/${p.id}`} className="block truncate text-sm font-medium hover:underline">
                    {p.name}
                  </Link>
                  <p className="text-[12px] text-muted">
                    {p.sku} · {totalStock(p)} units
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <StockInput key={s} product={p} size={s} />
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
