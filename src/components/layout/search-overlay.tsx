"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { categories } from "@/data/catalog";
import { categoryName, queryProducts } from "@/lib/catalog";
import { useProducts } from "@/lib/stores/catalog";
import { closeOverlay, overlayStore } from "@/lib/stores/ui";
import { Icon } from "../ui/icon";
import { Price } from "../ui/misc";
import { Sheet } from "../ui/sheet";
import { SmartImage } from "../ui/smart-image";

const SUGGESTIONS = ["Dress", "Linen", "Coat", "Denim", "Knit", "White shirt"];

export function SearchOverlay() {
  const overlay = overlayStore.use();
  const open = overlay === "search";
  const router = useRouter();
  const products = useProducts();
  const inputRef = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState("");

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(
    () => (term.trim().length > 1 ? queryProducts(products, { search: term }).slice(0, 6) : []),
    [products, term],
  );

  const submit = (value: string) => {
    const q = value.trim();
    if (!q) return;
    closeOverlay();
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <Sheet
      open={open}
      onClose={closeOverlay}
      title="Search"
      side="center"
      className="max-w-2xl sm:mt-[10vh] sm:mb-auto"
    >
      <div className="px-6 pb-6">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            submit(term);
          }}
          className="relative"
        >
          <Icon name="search" size={20} className="pointer-events-none absolute inset-y-0 left-4 my-auto text-muted" />
          <input
            ref={inputRef}
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search dresses, coats, colours…"
            aria-label="Search products"
            enterKeyHint="search"
            className="h-14 w-full rounded-2xl border border-line bg-paper pr-4 pl-12 text-base transition-[border-color,box-shadow] outline-none placeholder:text-subtle focus:border-ink focus:ring-4 focus:ring-ink/8"
          />
        </form>

        {term.trim().length > 1 ? (
          <div className="mt-5" aria-live="polite">
            {results.length === 0 ? (
              <p className="py-8 text-center text-[15px] text-muted">
                No results for &ldquo;{term}&rdquo;. Try a different word.
              </p>
            ) : (
              <>
                <ul className="grid gap-1">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/products/${p.slug}`}
                        onClick={closeOverlay}
                        className="flex items-center gap-4 rounded-xl p-2 transition-colors hover:bg-paper"
                      >
                        <span className="relative h-16 w-13 shrink-0 overflow-hidden rounded-lg">
                          <SmartImage src={p.images[0].src} alt="" fill sizes="52px" className="object-cover" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{p.name}</span>
                          <span className="block text-[13px] text-muted">{categoryName(p.category)}</span>
                        </span>
                        <Price price={p.price} compareAt={p.compareAtPrice} size="sm" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => submit(term)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium hover:bg-paper"
                >
                  See all results <Icon name="arrow-right" size={16} />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div>
              <p className="mb-3 eyebrow text-muted">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTerm(s)}
                    className="h-9 rounded-full border border-line px-4 text-[13px] transition-colors hover:border-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 eyebrow text-muted">Browse categories</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/collections/${c.slug}`}
                    onClick={closeOverlay}
                    className="h-9 content-center rounded-full bg-paper px-4 text-[13px] transition-colors hover:bg-sand"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
