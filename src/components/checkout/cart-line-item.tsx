"use client";

import Link from "next/link";
import { cn, formatPrice } from "@/lib/format";
import { removeLine, setLineQuantity, MAX_PER_LINE, type ResolvedLine } from "@/lib/stores/cart";
import { toast } from "@/lib/stores/ui";
import { Icon } from "../ui/icon";
import { QuantityStepper } from "../ui/quantity-stepper";
import { SmartImage } from "../ui/smart-image";

export function CartLineItem({
  item,
  compact = false,
  onNavigate,
}: {
  item: ResolvedLine;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { product } = item;
  const href = `/products/${product.slug}`;
  const soldOut = item.available === 0;
  const overStock = !soldOut && item.quantity > item.available;

  const remove = () => {
    removeLine(item.key);
    toast({ title: "Removed from bag", description: `${product.name} · ${item.size}` });
  };

  return (
    <li className={cn("flex gap-4", compact ? "py-5" : "py-6 sm:gap-6")}>
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-xl bg-sand",
          compact ? "h-[7.5rem] w-24" : "h-36 w-28 sm:h-44 sm:w-36",
        )}
      >
        <SmartImage
          src={product.images[0].src}
          alt={product.images[0].alt}
          fill
          sizes="144px"
          className="object-cover"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={href}
              onClick={onNavigate}
              className={cn(
                "line-clamp-2 font-medium hover:underline hover:underline-offset-4",
                compact ? "text-sm" : "text-[15px]",
              )}
            >
              {product.name}
            </Link>
            <p className="mt-1 text-[13px] text-muted">
              {item.color} · Size {item.size}
            </p>
          </div>
          <p className={cn("shrink-0 font-medium tabular-nums", compact ? "text-sm" : "text-[15px]")}>
            {formatPrice(item.lineTotal)}
          </p>
        </div>
        {!compact && item.quantity > 1 && (
          <p className="mt-1 text-[13px] text-muted tabular-nums">{formatPrice(product.price)} each</p>
        )}
        {(soldOut || overStock) && (
          <p className="mt-2 flex items-center gap-1.5 text-[13px] text-danger">
            <Icon name="alert" size={14} />
            {soldOut ? "Sold out — please remove" : `Only ${item.available} left — reduce quantity`}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <QuantityStepper
            size="sm"
            label={`Quantity for ${product.name}`}
            value={item.quantity}
            min={1}
            max={Math.max(1, Math.min(item.available, MAX_PER_LINE))}
            onChange={(q) => setLineQuantity(item.key, q)}
          />
          <button
            type="button"
            onClick={remove}
            className="flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] text-muted transition-colors hover:bg-sand hover:text-ink"
            aria-label={`Remove ${product.name} from bag`}
          >
            <Icon name="trash" size={16} />
            <span className={cn(compact && "sr-only")}>Remove</span>
          </button>
        </div>
      </div>
    </li>
  );
}
