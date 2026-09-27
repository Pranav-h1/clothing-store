import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/misc";
import { SuccessView } from "./success-view";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default function CheckoutSuccessPage() {
  return (
    <div className="container-page pt-12 pb-20 sm:pt-16">
      <Suspense fallback={<Skeleton className="mx-auto h-96 max-w-2xl rounded-3xl" />}>
        <SuccessView />
      </Suspense>
    </div>
  );
}
