import { ProductCardSkeleton } from "../product/product-card";

export function ShopSkeleton() {
  return (
    <div className="container-page pt-8 pb-20 sm:pt-12" aria-busy="true" aria-label="Loading products">
      <div className="h-14 w-64 skeleton rounded-2xl" />
      <div className="mt-8 flex gap-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-10 w-24 skeleton rounded-full" />
        ))}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:ml-[17rem]">
        {Array.from({ length: 6 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
