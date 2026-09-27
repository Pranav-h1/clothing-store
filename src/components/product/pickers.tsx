"use client";

import { useId } from "react";
import { LOW_STOCK_THRESHOLD, sizeStock } from "@/lib/catalog";
import { cn } from "@/lib/format";
import type { Product } from "@/lib/types";

export function SizePicker({
  product,
  value,
  onChange,
  error,
}: {
  product: Product;
  value: string | null;
  onChange: (size: string) => void;
  error?: string | null;
}) {
  const labelId = useId();
  const low = value ? sizeStock(product, value) : 0;
  return (
    <fieldset>
      <div className="mb-3 flex items-baseline justify-between">
        <legend id={labelId} className="text-[13px] font-medium text-ink-soft">
          Size{value && <span className="font-normal text-muted"> · {value}</span>}
        </legend>
        {value && low > 0 && low <= LOW_STOCK_THRESHOLD && (
          <span className="text-[13px] font-medium text-warning">Only {low} left</span>
        )}
      </div>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2">
        {product.sizes.map((size) => {
          const soldOut = sizeStock(product, size) === 0;
          const selected = value === size;
          return (
            <button
              key={size}
              type="button"
              aria-pressed={selected}
              aria-label={soldOut ? `${size}, sold out` : size}
              disabled={soldOut}
              onClick={() => onChange(size)}
              className={cn(
                "relative flex h-11 min-w-12 items-center justify-center rounded-xl border px-3.5 text-sm font-medium tabular-nums transition-[background-color,border-color,color] duration-150",
                selected ? "border-ink bg-ink text-paper" : "border-line-strong bg-surface text-ink hover:border-ink",
                soldOut &&
                  "cursor-not-allowed border-line bg-transparent text-subtle line-through decoration-subtle/70 hover:border-line",
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-[13px] text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function ColorPicker({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: string;
  onChange: (color: string) => void;
}) {
  const labelId = useId();
  return (
    <fieldset>
      <legend id={labelId} className="mb-3 text-[13px] font-medium text-ink-soft">
        Colour <span className="font-normal text-muted">· {value}</span>
      </legend>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-2.5">
        {product.colors.map((color) => {
          const selected = color.name === value;
          return (
            <button
              key={color.name}
              type="button"
              aria-pressed={selected}
              aria-label={color.name}
              title={color.name}
              onClick={() => onChange(color.name)}
              className={cn(
                "flex size-10 items-center justify-center rounded-full border-2 transition-colors",
                selected ? "border-ink" : "border-transparent hover:border-line-strong",
              )}
            >
              <span
                className="size-7 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function StockStatus({ units, className }: { units: number; className?: string }) {
  const out = units <= 0;
  const low = !out && units <= LOW_STOCK_THRESHOLD;
  return (
    <p className={cn("flex items-center gap-2 text-[13px]", className)}>
      <span
        className={cn("size-2 rounded-full", out ? "bg-danger" : low ? "bg-warning" : "bg-success")}
        aria-hidden="true"
      />
      <span className={cn(out ? "text-danger" : low ? "text-warning" : "text-ink-soft")}>
        {out ? "Sold out" : low ? "Low stock — order soon" : "In stock, ready to ship"}
      </span>
    </p>
  );
}
