"use client";

import { cn } from "@/lib/format";
import { useHydrated } from "@/lib/stores/persistent-store";
import { toast } from "@/lib/stores/ui";
import { toggleWishlist, useWishlist } from "@/lib/stores/wishlist";
import type { Product } from "@/lib/types";
import { Icon } from "../ui/icon";

export function WishlistButton({
  product,
  variant = "floating",
  className,
}: {
  product: Product;
  variant?: "floating" | "outline";
  className?: string;
}) {
  const hydrated = useHydrated();
  const ids = useWishlist();
  const saved = hydrated && ids.includes(product.id);

  const onClick = () => {
    const nowSaved = toggleWishlist(product.id);
    toast({
      tone: nowSaved ? "success" : "neutral",
      title: nowSaved ? "Saved to wishlist" : "Removed from wishlist",
      description: product.name,
      action: nowSaved ? { label: "View wishlist", href: "/wishlist" } : undefined,
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={cn(
        "flex items-center justify-center rounded-full transition-[background-color,color,transform,border-color] duration-200 active:scale-90",
        variant === "floating" && "size-10 text-ink shadow-soft glass hover:bg-surface",
        variant === "outline" && "size-13 border border-line-strong hover:border-ink",
        saved && "text-accent",
        className,
      )}
    >
      <Icon key={String(saved)} name="heart" size={19} filled={saved} className={cn(saved && "animate-pop")} />
    </button>
  );
}
