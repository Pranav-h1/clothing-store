"use client";

import Link from "next/link";
import { useState } from "react";
import { categoryName } from "@/lib/catalog";
import { useProducts } from "@/lib/stores/catalog";
import { closeQuickView, quickViewStore } from "@/lib/stores/quick-view";
import { useMediaQuery } from "@/lib/use-media-query";
import { Icon } from "../ui/icon";
import { Price } from "../ui/misc";
import { Sheet } from "../ui/sheet";
import { SmartImage } from "../ui/smart-image";
import { PurchasePanel } from "./purchase-panel";

export function QuickView() {
  const id = quickViewStore.use();
  const products = useProducts();
  const desktop = useMediaQuery("(min-width: 768px)", true);
  const current = products.find((p) => p.id === id);
  // Keep showing the last product while the sheet animates closed.
  const [product, setProduct] = useState(current);
  if (current && current !== product) setProduct(current);

  return (
    <Sheet
      open={Boolean(current)}
      onClose={closeQuickView}
      title={product ? product.name : "Quick view"}
      hideTitle
      side={desktop ? "center" : "bottom"}
      className="md:max-w-4xl"
    >
      {product && (
        <div className="grid md:grid-cols-2">
          <div className="relative hidden aspect-[3/4] bg-sand md:block">
            <SmartImage
              src={product.images[0].src}
              alt={product.images[0].alt}
              fill
              sizes="450px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col p-6 pt-7 md:p-8">
            <div className="mb-6 flex gap-4">
              <div className="relative h-28 w-21 shrink-0 overflow-hidden rounded-xl md:hidden">
                <SmartImage src={product.images[0].src} alt="" fill sizes="84px" className="object-cover" />
              </div>
              <div className="pr-10">
                <p className="eyebrow text-muted">{categoryName(product.category)}</p>
                <h3 className="mt-2 font-display text-3xl leading-tight">{product.name}</h3>
                <Price price={product.price} compareAt={product.compareAtPrice} className="mt-2" />
              </div>
            </div>
            <PurchasePanel key={product.id} product={product} compact onAdded={closeQuickView} />
            <Link
              href={`/products/${product.slug}`}
              onClick={closeQuickView}
              className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-medium underline-offset-4 hover:underline"
            >
              View full details <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        </div>
      )}
    </Sheet>
  );
}
