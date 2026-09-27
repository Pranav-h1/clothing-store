"use client";

import { useEffect, useMemo, useState } from "react";
import { categories } from "@/data/catalog";
import { categoryName, queryProducts, SORT_OPTIONS, type SortKey } from "@/lib/catalog";
import { cn, formatPrice, pluralize } from "@/lib/format";
import { useProducts } from "@/lib/stores/catalog";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
import { EmptyState } from "../ui/misc";
import { Sheet } from "../ui/sheet";
import { ProductCard } from "../product/product-card";
import { FilterPanel } from "./filter-panel";
import { useShopQuery } from "./use-shop-query";

const PAGE_SIZE = 12;

const QUICK_TITLES = { new: "New in", bestsellers: "Best sellers", sale: "Sale" } as const;

export function ShopView({
  lockedCategory,
}: {
  /** Collection pages lock the category filter and provide their own heading. */
  lockedCategory?: string;
}) {
  const products = useProducts();
  const { state, update, clear, activeCount } = useShopQuery();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [searchDraft, setSearchDraft] = useState(state.search);

  // Keep the search box in sync when the URL changes (e.g. from the header search).
  const [syncedSearch, setSyncedSearch] = useState(state.search);
  if (syncedSearch !== state.search) {
    setSyncedSearch(state.search);
    setSearchDraft(state.search);
  }

  const scoped = useMemo(
    () => (lockedCategory ? products.filter((p) => p.category === lockedCategory) : products),
    [products, lockedCategory],
  );
  const results = useMemo(() => queryProducts(scoped, state), [scoped, state]);
  const availableSizes = useMemo(() => [...new Set(scoped.flatMap((p) => p.sizes))], [scoped]);

  // Reset pagination when the result set changes.
  const resultKey = JSON.stringify(state);
  const [pagedKey, setPagedKey] = useState(resultKey);
  if (pagedKey !== resultKey) {
    setPagedKey(resultKey);
    setLimit(PAGE_SIZE);
  }

  // Debounced search-as-you-type.
  useEffect(() => {
    if (searchDraft === state.search) return;
    const t = window.setTimeout(() => update({ search: searchDraft.trim() }), 350);
    return () => window.clearTimeout(t);
  }, [searchDraft, state.search, update]);

  const heading = state.search
    ? `Results for “${state.search}”`
    : state.quick
      ? QUICK_TITLES[state.quick]
      : state.categories.length === 1
        ? categoryName(state.categories[0])
        : "Shop all";

  const chips: { label: string; remove: () => void }[] = [
    ...(state.quick ? [{ label: QUICK_TITLES[state.quick], remove: () => update({ quick: null }) }] : []),
    ...state.categories.map((c) => ({
      label: categoryName(c),
      remove: () => update({ categories: state.categories.filter((x) => x !== c) }),
    })),
    ...state.sizes.map((s) => ({
      label: `Size ${s}`,
      remove: () => update({ sizes: state.sizes.filter((x) => x !== s) }),
    })),
    ...(state.minPrice !== null || state.maxPrice !== null
      ? [
          {
            label:
              state.minPrice !== null && state.maxPrice !== null
                ? `${formatPrice(state.minPrice)} – ${formatPrice(state.maxPrice)}`
                : state.minPrice !== null
                  ? `Over ${formatPrice(state.minPrice)}`
                  : `Under ${formatPrice(state.maxPrice!)}`,
            remove: () => update({ minPrice: null, maxPrice: null }),
          },
        ]
      : []),
    ...(state.inStockOnly ? [{ label: "In stock", remove: () => update({ inStockOnly: false }) }] : []),
  ];

  const visible = results.slice(0, limit);

  return (
    <div className={cn("container-page pb-20", lockedCategory ? "pt-8" : "pt-8 sm:pt-12")}>
      {/* Heading */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        {!lockedCategory && (
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl leading-[1] sm:text-6xl">{heading}</h1>
          </div>
        )}
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            update({ search: searchDraft.trim() });
          }}
          className={cn("relative w-full md:w-80", lockedCategory && "md:ml-auto")}
        >
          <Icon name="search" size={18} className="pointer-events-none absolute inset-y-0 left-4 my-auto text-muted" />
          <input
            type="search"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder={lockedCategory ? `Search ${categoryName(lockedCategory).toLowerCase()}` : "Search the store"}
            aria-label="Search products"
            className="h-12 w-full rounded-full border border-line-strong bg-surface pr-4 pl-11 text-[15px] transition-[border-color,box-shadow] outline-none placeholder:text-subtle focus:border-ink focus:ring-4 focus:ring-ink/8"
          />
        </form>
      </div>

      {/* Category chips (not on collection pages) */}
      {!lockedCategory && (
        <nav aria-label="Categories" className="-mx-5 mt-8 scrollbar-none overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <ul className="flex gap-2">
            <li>
              <button
                type="button"
                onClick={() => update({ categories: [] })}
                aria-pressed={state.categories.length === 0}
                className={cn(
                  "h-10 rounded-full px-5 text-sm whitespace-nowrap transition-colors",
                  state.categories.length === 0 ? "bg-ink text-paper" : "bg-sand hover:bg-sand-deep",
                )}
              >
                All
              </button>
            </li>
            {categories.map((c) => {
              const active = state.categories.length === 1 && state.categories[0] === c.slug;
              return (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => update({ categories: active ? [] : [c.slug] })}
                    aria-pressed={active}
                    className={cn(
                      "h-10 rounded-full px-5 text-sm whitespace-nowrap transition-colors",
                      active ? "bg-ink text-paper" : "bg-sand hover:bg-sand-deep",
                    )}
                  >
                    {c.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_1fr] xl:grid-cols-[16.5rem_1fr]">
        {/* Desktop sidebar */}
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pr-2 pb-6">
            <FilterPanel
              state={state}
              update={update}
              lockedCategory={lockedCategory}
              availableSizes={availableSizes}
            />
          </div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className="text-sm whitespace-nowrap text-muted" aria-live="polite">
              {pluralize(results.length, "product")}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
                <Icon name="filter" size={16} />
                Filters
                {activeCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-ink text-[11px] text-paper">
                    {activeCount}
                  </span>
                )}
              </Button>
              <label className="relative">
                <span className="sr-only">Sort by</span>
                <select
                  value={state.sort}
                  onChange={(e) => update({ sort: e.target.value as SortKey })}
                  className="h-9 appearance-none rounded-full border border-line-strong bg-transparent pr-9 pl-4 text-[13px] font-medium outline-none hover:border-ink focus-visible:border-ink"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  size={14}
                  className="pointer-events-none absolute inset-y-0 right-3.5 my-auto"
                />
              </label>
            </div>
          </div>

          {/* Active filters */}
          {chips.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.remove}
                  className="flex h-8 items-center gap-1.5 rounded-full bg-sand pr-2.5 pl-3.5 text-[13px] transition-colors hover:bg-sand-deep"
                  aria-label={`Remove filter: ${chip.label}`}
                >
                  {chip.label}
                  <Icon name="close" size={14} />
                </button>
              ))}
              <button
                type="button"
                onClick={clear}
                className="ml-1 text-[13px] text-muted underline underline-offset-4 hover:text-ink"
              >
                Clear all
              </button>
            </div>
          )}

          {results.length === 0 ? (
            <EmptyState
              icon="search"
              title="Nothing matches — yet"
              body="Try removing a filter or searching for something broader."
              action={
                <Button variant="outline" onClick={clear}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <h2 className="sr-only">Products</h2>
              <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3">
                {visible.map((product, i) => (
                  <li key={product.id}>
                    <ProductCard
                      product={product}
                      priority={i < 3}
                      sizes="(min-width: 1280px) 24vw, (min-width: 768px) 30vw, 48vw"
                    />
                  </li>
                ))}
              </ul>
              {results.length > limit && (
                <div className="mt-14 flex flex-col items-center gap-4">
                  <p className="text-[13px] text-muted">
                    Showing {visible.length} of {results.length}
                  </p>
                  <div className="h-0.5 w-48 overflow-hidden rounded-full bg-sand-deep">
                    <div className="h-full bg-ink" style={{ width: `${(visible.length / results.length) * 100}%` }} />
                  </div>
                  <Button variant="outline" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filters */}
      <Sheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        side="bottom"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={clear} disabled={activeCount === 0}>
              Clear all
            </Button>
            <Button onClick={() => setFiltersOpen(false)}>Show {pluralize(results.length, "result")}</Button>
          </div>
        }
      >
        <div className="px-6 pb-2">
          <FilterPanel state={state} update={update} lockedCategory={lockedCategory} availableSizes={availableSizes} />
        </div>
      </Sheet>
    </div>
  );
}
