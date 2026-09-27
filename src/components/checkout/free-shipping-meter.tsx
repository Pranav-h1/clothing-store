import { business } from "@/config/business";
import { cn, formatPrice } from "@/lib/format";
import { amountToFreeShipping } from "@/lib/pricing";
import { Icon } from "../ui/icon";

export function FreeShippingMeter({ subtotal, className }: { subtotal: number; className?: string }) {
  const threshold = business.shipping.freeShippingThreshold;
  if (threshold === null) return null;
  const remaining = amountToFreeShipping(subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);
  return (
    <div className={cn("rounded-2xl bg-paper p-4", className)}>
      <p className="flex items-center gap-2 text-[13px] text-ink-soft">
        <Icon name="truck" size={17} className="shrink-0" />
        {remaining === null ? (
          <span>
            <strong className="font-semibold text-success">You&rsquo;ve unlocked free shipping</strong>
          </span>
        ) : (
          <span>
            Add <strong className="font-semibold tabular-nums">{formatPrice(remaining)}</strong> more for free shipping
          </span>
        )}
      </p>
      <div
        className="mt-3 h-1 overflow-hidden rounded-full bg-sand-deep"
        role="progressbar"
        aria-label="Progress to free shipping"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 ease-(--ease-out-soft)",
            remaining === null ? "bg-success" : "bg-ink",
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
