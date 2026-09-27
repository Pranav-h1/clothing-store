import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopSkeleton } from "@/components/shop/shop-skeleton";
import { ShopView } from "@/components/shop/shop-view";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Browse the full collection — dresses, outerwear, knitwear, tailoring and everyday essentials.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopView />
    </Suspense>
  );
}
