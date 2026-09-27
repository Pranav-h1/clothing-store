"use client";

import { useMemo } from "react";
import { queryProducts, type QuickFilter } from "@/lib/catalog";
import { useProducts } from "@/lib/stores/catalog";
import type { Product } from "@/lib/types";
import { ButtonLink } from "../ui/button";
import { Icon } from "../ui/icon";
import { SectionHeading } from "../ui/misc";
import { ProductCard } from "./product-card";

type RailFilter = QuickFilter | "featured";

function pick(products: Product[], filter: RailFilter, excludeFeatured: boolean): Product[] {
  if (filter === "featured") return queryProducts(products, { inStockOnly: true }).filter((p) => p.featured);
  const list = queryProducts(products, {
    quick: filter,
    inStockOnly: true,
    sort: filter === "new" ? "newest" : "featured",
  });
  // Prefer pieces not already shown in a "featured" rail on the same page.
  return excludeFeatured ? [...list.filter((p) => !p.featured), ...list.filter((p) => p.featured)] : list;
}

/** A titled row of products: swipeable on phones, a grid from tablet up. */
export function ProductRail({
  eyebrow,
  title,
  filter,
  href,
  limit = 4,
  excludeFeatured = false,
}: {
  eyebrow?: string;
  title: string;
  filter: RailFilter;
  href: string;
  limit?: number;
  excludeFeatured?: boolean;
}) {
  const products = useProducts();
  const items = useMemo(
    () => pick(products, filter, excludeFeatured).slice(0, limit),
    [products, filter, limit, excludeFeatured],
  );
  if (items.length === 0) return null;

  return (
    <section className="py-14 sm:py-20" aria-label={title}>
      <div className="container-page">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          action={
            <span className="hidden sm:block">
              <ButtonLink href={href} variant="outline" size="sm">
                View all <Icon name="arrow-right" size={15} />
              </ButtonLink>
            </span>
          }
        />
      </div>
      <div className="container-page mt-8 sm:mt-10">
        <ul className="-mx-5 scrollbar-none flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {items.map((product) => (
            <li key={product.id} className="w-[68vw] max-w-[20rem] shrink-0 snap-start sm:w-auto sm:max-w-none">
              <ProductCard product={product} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 68vw" />
            </li>
          ))}
        </ul>
        <div className="mt-6 sm:hidden">
          <ButtonLink href={href} variant="outline" className="w-full">
            View all <Icon name="arrow-right" size={15} />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
