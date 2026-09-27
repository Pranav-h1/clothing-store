import type { Metadata } from "next";
import { Icon } from "@/components/ui/icon";
import { CheckoutView } from "./checkout-view";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-page pt-10 pb-20 sm:pt-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
        <h1 className="font-display text-5xl sm:text-6xl">Checkout</h1>
        <p className="flex items-center gap-2 text-[13px] text-muted">
          <Icon name="lock" size={16} /> Secure, encrypted checkout
        </p>
      </div>
      <CheckoutView />
    </div>
  );
}
