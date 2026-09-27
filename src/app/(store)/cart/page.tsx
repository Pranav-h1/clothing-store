import type { Metadata } from "next";
import { CartView } from "./cart-view";

export const metadata: Metadata = { title: "Your bag" };

export default function CartPage() {
  return <CartView />;
}
