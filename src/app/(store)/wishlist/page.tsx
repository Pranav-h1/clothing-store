import type { Metadata } from "next";
import { WishlistView } from "./wishlist-view";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <div className="container-page pt-10 pb-20 sm:pt-14">
      <p className="eyebrow text-muted">Saved for later</p>
      <h1 className="mt-2 mb-8 font-display text-5xl sm:text-6xl">Wishlist</h1>
      <WishlistView />
    </div>
  );
}
