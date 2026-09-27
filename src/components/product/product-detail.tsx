"use client";

import { useMemo, type ReactNode } from "react";
import { business } from "@/config/business";
import { categoryName, isOnSale, discountPercent, relatedProducts } from "@/lib/catalog";
import { useProduct, useProducts } from "@/lib/stores/catalog";
import { Breadcrumbs } from "../ui/breadcrumbs";
import { ButtonLink } from "../ui/button";
import { Icon, type IconName } from "../ui/icon";
import { Badge, EmptyState, Price, SectionHeading } from "../ui/misc";
import { ProductCard } from "./product-card";
import { ProductGallery } from "./product-gallery";
import { PurchasePanel } from "./purchase-panel";

function InfoSection({
  title,
  icon,
  children,
  open = false,
}: {
  title: string;
  icon: IconName;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details open={open} className="group border-t border-line">
      <summary className="flex list-none items-center gap-3 py-5 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
        <Icon name={icon} size={19} className="text-muted" />
        <span className="flex-1">{title}</span>
        <Icon name="plus" size={18} className="text-muted transition-transform duration-300 group-open:rotate-45" />
      </summary>
      <div className="pb-6 pl-8 text-[15px] leading-relaxed text-muted">{children}</div>
    </details>
  );
}

export function ProductDetail({ slug }: { slug: string }) {
  const product = useProduct(slug);
  const products = useProducts();
  const related = useMemo(() => (product ? relatedProducts(products, product) : []), [products, product]);

  if (!product) {
    return (
      <EmptyState
        icon="search"
        title="Product not found"
        body="This piece may have sold out for good or moved. Explore the rest of the collection instead."
        action={<ButtonLink href="/shop">Browse the shop</ButtonLink>}
      />
    );
  }

  return (
    <div className="container-page pt-4 pb-10 sm:pt-6">
      <Breadcrumbs
        className="mb-5"
        items={[
          { label: "Home", href: "/" },
          { label: categoryName(product.category), href: `/collections/${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 md:grid-cols-12 md:gap-10 lg:gap-14">
        <div className="md:col-span-6 lg:col-span-7">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="md:col-span-6 lg:col-span-5">
          <div className="md:sticky md:top-28">
            <div className="flex flex-wrap items-center gap-2">
              <p className="eyebrow text-muted">{categoryName(product.category)}</p>
              {product.isNew && <Badge>New</Badge>}
              {isOnSale(product) && <Badge tone="accent">Save {discountPercent(product)}%</Badge>}
            </div>
            <h1 className="mt-3 font-display text-[2.75rem] leading-[1] sm:text-5xl">{product.name}</h1>
            <Price price={product.price} compareAt={product.compareAtPrice} size="lg" className="mt-4" />
            <p className="mt-1 text-[13px] text-muted">Taxes and shipping calculated at checkout.</p>

            <p className="mt-6 text-[15px] leading-relaxed text-ink-soft">{product.description}</p>

            <div className="mt-8">
              <PurchasePanel key={product.id} product={product} />
            </div>

            <ul className="mt-8 grid grid-cols-3 gap-2 text-center">
              {(
                [
                  ["truck", "Free shipping", "over threshold"],
                  ["return", "Easy returns", "placeholder policy"],
                  ["lock", "Secure checkout", "via Razorpay"],
                ] as const
              ).map(([icon, title, sub]) => (
                <li key={title} className="rounded-2xl bg-sand/60 px-2 py-4">
                  <Icon name={icon} size={20} className="mx-auto" strokeWidth={1.5} />
                  <p className="mt-2 text-[12px] font-medium">{title}</p>
                  <p className="text-[11px] text-muted">{sub}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-b border-line">
              <InfoSection title="Product details" icon="info" open>
                <ul className="list-disc space-y-1 pl-4">
                  {product.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <p className="mt-3 text-[13px]">SKU: {product.sku}</p>
              </InfoSection>
              <InfoSection title="Material & care" icon="leaf">
                <p>
                  <span className="font-medium text-ink-soft">Material: </span>
                  {product.material}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-4">
                  {product.care.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </InfoSection>
              <InfoSection title="Shipping & returns" icon="truck">
                <p>{business.shipping.estimate}</p>
                <p className="mt-2">{business.shipping.returnsSummary}</p>
              </InfoSection>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20 sm:mt-28" aria-label="You may also like">
          <SectionHeading eyebrow="Complete the look" title="You may also like" />
          <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} sizes="(min-width: 1024px) 22vw, 48vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
