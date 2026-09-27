"use client";

import { ProductCard, ProductCardSkeleton } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/misc";
import { pluralize } from "@/lib/format";
import { useProducts } from "@/lib/stores/catalog";
import { useHydrated } from "@/lib/stores/persistent-store";
import { useWishlist } from "@/lib/stores/wishlist";

export function WishlistView() {
  const hydrated = useHydrated();
  const ids = useWishlist();
  const products = useProducts();
  const saved = ids.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined);

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (saved.length === 0) {
    return (
      <EmptyState
        icon="heart"
        title="Nothing saved yet"
        body="Tap the heart on any piece to keep it here for later."
        action={<ButtonLink href="/shop">Discover the collection</ButtonLink>}
      />
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-muted">{pluralize(saved.length, "piece")} saved on this device.</p>
      <h2 className="sr-only">Saved pieces</h2>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {saved.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
