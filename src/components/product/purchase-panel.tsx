"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { sizeStock, totalStock } from "@/lib/catalog";
import { cn } from "@/lib/format";
import { addToCart, MAX_PER_LINE } from "@/lib/stores/cart";
import { openOverlay, toast } from "@/lib/stores/ui";
import type { Product } from "@/lib/types";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
import { QuantityStepper } from "../ui/quantity-stepper";
import { ColorPicker, SizePicker, StockStatus } from "./pickers";
import { WishlistButton } from "./wishlist-button";

/** Colour, size, quantity and purchase actions — shared by the product page and quick view. */
export function PurchasePanel({
  product,
  compact = false,
  onAdded,
}: {
  product: Product;
  compact?: boolean;
  onAdded?: () => void;
}) {
  const router = useRouter();
  const singleSize = product.sizes.length === 1 ? product.sizes[0] : null;
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<string | null>(singleSize);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const soldOut = totalStock(product) === 0;
  const available = size ? Math.min(sizeStock(product, size), MAX_PER_LINE) : MAX_PER_LINE;

  function add(): boolean {
    if (!size) {
      setSizeError("Please choose a size.");
      return false;
    }
    const added = addToCart(product, size, color, Math.min(quantity, available));
    if (added === 0) {
      toast({
        tone: "error",
        title: "No more stock",
        description: "Your bag already has every available piece in this size.",
      });
      return false;
    }
    return true;
  }

  return (
    <div className={cn("flex flex-col", compact ? "gap-6" : "gap-7")}>
      {product.colors.length > 0 && <ColorPicker product={product} value={color} onChange={setColor} />}
      {!singleSize && (
        <SizePicker
          product={product}
          value={size}
          onChange={(s) => {
            setSize(s);
            setSizeError(null);
            setQuantity((q) => Math.min(q, Math.max(1, sizeStock(product, s))));
          }}
          error={sizeError}
        />
      )}

      <StockStatus units={size ? sizeStock(product, size) : totalStock(product)} />

      {soldOut ? (
        <div className="flex gap-3">
          <Button size="lg" disabled className="flex-1">
            Sold out
          </Button>
          {!compact && <WishlistButton product={product} variant="outline" />}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <QuantityStepper label="Quantity" value={quantity} max={Math.max(1, available)} onChange={setQuantity} />
            <Button
              size="lg"
              className="h-12 flex-1"
              onClick={() => {
                if (!add()) return;
                onAdded?.();
                openOverlay("cart");
              }}
            >
              <Icon name="bag" size={18} />
              Add to bag
            </Button>
            {!compact && <WishlistButton product={product} variant="outline" className="hidden size-12 sm:flex" />}
          </div>
          {!compact && (
            <div className="flex gap-3">
              <Button
                size="lg"
                variant="outline"
                className="h-12 flex-1"
                onClick={() => {
                  if (add()) router.push("/checkout");
                }}
              >
                Buy now
              </Button>
              <WishlistButton product={product} variant="outline" className="size-12 sm:hidden" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
