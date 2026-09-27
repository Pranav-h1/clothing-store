"use client";

import { cn } from "@/lib/format";
import { Icon } from "./icon";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  label: string;
  size?: "sm" | "md";
  className?: string;
};

export function QuantityStepper({ value, onChange, min = 1, max, label, size = "md", className }: Props) {
  const btn =
    "flex h-full items-center justify-center text-ink transition-colors hover:bg-sand disabled:text-subtle disabled:hover:bg-transparent";
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-full border border-line-strong bg-surface",
        size === "sm" ? "h-9" : "h-12",
        className,
      )}
    >
      <button
        type="button"
        className={cn(btn, size === "sm" ? "w-9" : "w-12")}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" size={size === "sm" ? 14 : 16} />
      </button>
      <output
        aria-live="polite"
        className={cn(
          "flex items-center justify-center font-medium tabular-nums",
          size === "sm" ? "w-7 text-sm" : "w-10",
        )}
      >
        {value}
      </output>
      <button
        type="button"
        className={cn(btn, size === "sm" ? "w-9" : "w-12")}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Icon name="plus" size={size === "sm" ? 14 : 16} />
      </button>
    </div>
  );
}
