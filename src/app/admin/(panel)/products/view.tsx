"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Badge, EmptyState } from "@/components/ui/misc";
import { Sheet } from "@/components/ui/sheet";
import { SmartImage } from "@/components/ui/smart-image";
import { categories } from "@/data/catalog";
import { categoryName, queryProducts, totalStock } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { deleteProduct, useProducts } from "@/lib/stores/catalog";
import { toast } from "@/lib/stores/ui";
import type { Product } from "@/lib/types";

function StockCell({ units }: { units: number }) {
  if (units === 0) return <Badge tone="danger">Out of stock</Badge>;
  if (units <= 10) return <Badge tone="warning">{units} in stock</Badge>;
  return <span className="text-sm text-ink-soft tabular-nums">{units} in stock</span>;
}

export default function AdminProductsPage() {
  const products = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);

  const rows = useMemo(
    () => queryProducts(products, { search, categories: category ? [category] : [], sort: "newest" }),
    [products, search, category],
  );

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={`${products.length} products in the catalog`}
        action={
          <ButtonLink href="/admin/products/new">
            <Icon name="plus" size={17} /> Add product
          </ButtonLink>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search products</span>
          <Icon name="search" size={18} className="pointer-events-none absolute inset-y-0 left-4 my-auto text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, colour, material…"
            className="h-11 w-full rounded-xl border border-line-strong bg-surface pr-4 pl-11 text-sm outline-none focus:border-ink"
          />
        </label>
        <label className="relative sm:w-56">
          <span className="sr-only">Filter by category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-line-strong bg-surface pr-10 pl-4 text-sm outline-none focus:border-ink"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <Icon
            name="chevron-down"
            size={16}
            className="pointer-events-none absolute inset-y-0 right-4 my-auto text-muted"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {rows.length === 0 ? (
          <EmptyState icon="box" title="No products found" body="Try a different search or category." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="border-b border-line bg-paper/60 text-[12px] text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Product
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Stock
                  </th>
                  <th scope="col" className="px-3 py-3 font-medium">
                    Tags
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-paper/60">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-sand">
                          <SmartImage src={p.images[0].src} alt="" fill sizes="44px" className="object-cover" />
                        </span>
                        <div className="min-w-0">
                          <Link href={`/admin/products/${p.id}`} className="block truncate font-medium hover:underline">
                            {p.name}
                          </Link>
                          <p className="text-[12px] text-muted">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-ink-soft">{categoryName(p.category)}</td>
                    <td className="px-3 py-3 tabular-nums">
                      {formatPrice(p.price)}
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <s className="ml-1.5 text-[12px] text-muted">{formatPrice(p.compareAtPrice)}</s>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <StockCell units={totalStock(p)} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.featured && <Badge>Featured</Badge>}
                        {p.isNew && <Badge tone="info">New</Badge>}
                        {p.bestseller && <Badge tone="success">Best seller</Badge>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/products/${p.slug}`}
                          className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-sand hover:text-ink"
                          aria-label={`View ${p.name} in store`}
                        >
                          <Icon name="eye" size={17} />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-sand hover:text-ink"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Icon name="edit" size={17} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(p)}
                          className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-danger-soft hover:text-danger"
                          aria-label={`Delete ${p.name}`}
                        >
                          <Icon name="trash" size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Sheet
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title="Delete product?"
        side="center"
        className="max-w-md"
      >
        <div className="px-6 pb-6">
          <p className="text-[15px] leading-relaxed text-muted">
            <strong className="font-medium text-ink">{pendingDelete?.name}</strong> will be removed from the store.
            Existing orders keep their records.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!pendingDelete) return;
                deleteProduct(pendingDelete.id);
                toast({ title: "Product deleted", description: pendingDelete.name });
                setPendingDelete(null);
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  );
}
