"use client";

import Link from "next/link";
import { categoryName, discountPercent, isOnSale, sizeStock, totalStock } from "@/lib/catalog";
import { cn } from "@/lib/format";
import { addToCart } from "@/lib/stores/cart";
import { openQuickView } from "@/lib/stores/quick-view";
import { toast } from "@/lib/stores/ui";
import type { Product } from "@/lib/types";
import { Icon } from "../ui/icon";
import { Badge, Price } from "../ui/misc";
import { SmartImage } from "../ui/smart-image";
import { WishlistButton } from "./wishlist-button";

export function quickAdd(product: Product, size: string) {
  const color = product.colors[0].name;
  const added = addToCart(product, size, color, 1);
  if (added > 0) {
    toast({
      tone: "success",
      title: "Added to bag",
      description: `${product.name} · ${size}`,
      action: { label: "View bag & checkout", href: "/cart" },
    });
  } else {
    toast({
      tone: "error",
      title: "No more stock",
      description: `You already have all available ${size} in your bag.`,
    });
  }
}

export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw",
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
}) {
  const href = `/products/${product.slug}`;
  const stock = totalStock(product);
  const soldOut = stock === 0;
  const [primary, secondary] = product.images;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0">
          <SmartImage
            src={primary.src}
            alt=""
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              "object-cover transition-[transform,opacity] duration-700 ease-(--ease-out-soft) group-hover:scale-[1.03]",
              secondary && "md:group-hover:opacity-0",
              soldOut && "opacity-70",
            )}
          />
          {secondary && (
            <SmartImage
              src={secondary.src}
              alt=""
              fill
              sizes={sizes}
              className="hidden object-cover opacity-0 transition-[transform,opacity] duration-700 ease-(--ease-out-soft) group-hover:scale-[1.03] md:block md:group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {soldOut ? (
            <Badge tone="dark">Sold out</Badge>
          ) : (
            <>
              {isOnSale(product) && <Badge tone="accent">−{discountPercent(product)}%</Badge>}
              {product.isNew && <Badge className="bg-surface/90 backdrop-blur">New</Badge>}
            </>
          )}
        </div>

        <WishlistButton product={product} className="absolute top-2.5 right-2.5" />

        {/* Desktop: quick add on hover */}
        {!soldOut && (
          <div className="absolute inset-x-2.5 bottom-2.5 hidden translate-y-2 opacity-0 transition-[opacity,transform] duration-300 ease-(--ease-out-soft) group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 md:block">
            <div className="rounded-xl p-2.5 shadow-soft glass">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-[12px] font-medium text-ink-soft">Quick add</p>
                <button
                  type="button"
                  onClick={() => openQuickView(product.id)}
                  className="text-[12px] text-muted underline-offset-2 hover:text-ink hover:underline"
                >
                  Quick view
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {product.sizes.map((size) => {
                  const out = sizeStock(product, size) === 0;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={out}
                      onClick={() => quickAdd(product, size)}
                      aria-label={`Add ${product.name}, size ${size}, to bag`}
                      className="h-8 min-w-9 flex-1 rounded-lg bg-surface/80 px-2 text-[12px] font-medium transition-colors hover:bg-ink hover:text-paper disabled:bg-transparent disabled:text-subtle disabled:line-through"
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Touch: quick view button */}
        <button
          type="button"
          onClick={() => openQuickView(product.id)}
          className="absolute right-2.5 bottom-2.5 flex size-10 items-center justify-center rounded-full shadow-soft glass active:scale-90 md:hidden"
          aria-label={`Quick view ${product.name}`}
        >
          <Icon name="plus" size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-0.5 pt-3.5">
        <p className="text-[11px] tracking-[0.12em] text-muted uppercase">{categoryName(product.category)}</p>
        <h3 className="text-[14px] leading-snug font-medium sm:text-[15px]">
          <Link href={href} className="rounded-sm">
            <span className="hover:underline hover:underline-offset-4">{product.name}</span>
          </Link>
        </h3>
        <div className="mt-0.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <Price price={product.price} compareAt={product.compareAtPrice} size="sm" />
          {product.colors.length > 1 && (
            <span className="flex items-center gap-1" role="img" aria-label={`${product.colors.length} colours`}>
              {product.colors.slice(0, 4).map((c) => (
                <span
                  key={c.name}
                  className="size-3 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.14)]"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[11px] text-muted">+{product.colors.length - 4}</span>
              )}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="aspect-[3/4] skeleton rounded-2xl" />
      <div className="mt-4 h-3 w-1/3 skeleton rounded-full" />
      <div className="mt-2.5 h-4 w-3/4 skeleton rounded-full" />
      <div className="mt-2.5 h-4 w-1/4 skeleton rounded-full" />
    </div>
  );
}
