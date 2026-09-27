"use client";

import { useState, type ReactNode } from "react";
import { business } from "@/config/business";
import { categories } from "@/data/catalog";
import { cn, formatPrice } from "@/lib/format";
import { Checkbox } from "../ui/field";
import { Icon } from "../ui/icon";
import type { ShopState } from "./use-shop-query";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "26", "28", "30", "32", "34", "One Size"];

export const PRICE_PRESETS: { label: string; min: number | null; max: number | null }[] = [
  { label: `Under ${formatPrice(2500)}`, min: null, max: 2500 },
  { label: `${formatPrice(2500)} – ${formatPrice(5000)}`, min: 2500, max: 5000 },
  { label: `${formatPrice(5000)} – ${formatPrice(10000)}`, min: 5000, max: 10000 },
  { label: `Over ${formatPrice(10000)}`, min: 10000, max: null },
];

function Group({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-line py-5 first:pt-0">
      <summary className="flex list-none items-center justify-between text-[13px] font-semibold tracking-[0.08em] uppercase [&::-webkit-details-marker]:hidden">
        {title}
        <Icon name="chevron-down" size={16} className="text-muted transition-transform group-open:rotate-180" />
      </summary>
      <div className="pt-4">{children}</div>
    </details>
  );
}

function PriceInputs({ state, update }: { state: ShopState; update: (patch: Partial<ShopState>) => void }) {
  const [min, setMin] = useState(state.minPrice?.toString() ?? "");
  const [max, setMax] = useState(state.maxPrice?.toString() ?? "");
  const apply = () => {
    const lo = min === "" ? null : Math.max(0, Number(min));
    const hi = max === "" ? null : Math.max(0, Number(max));
    update({
      minPrice: lo !== null && hi !== null && lo > hi ? hi : lo,
      maxPrice: lo !== null && hi !== null && lo > hi ? lo : hi,
    });
  };
  const input =
    "h-10 w-full rounded-lg border border-line-strong bg-surface pr-2 pl-7 text-sm tabular-nums outline-none focus:border-ink";
  return (
    <form
      className="mt-4 flex items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
    >
      {[
        { label: "Min", name: "Minimum price", value: min, set: setMin },
        { label: "Max", name: "Maximum price", value: max, set: setMax },
      ].map((f) => (
        <label key={f.label} className="flex-1">
          <span className="mb-1 block text-[12px] text-muted">{f.label}</span>
          <span className="relative block">
            <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-[13px] text-muted">
              {business.currency.symbol}
            </span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              onBlur={apply}
              className={input}
              aria-label={f.name}
            />
          </span>
        </label>
      ))}
      <button type="submit" className="sr-only">
        Apply price
      </button>
    </form>
  );
}

export function FilterPanel({
  state,
  update,
  lockedCategory,
  availableSizes,
}: {
  state: ShopState;
  update: (patch: Partial<ShopState>) => void;
  lockedCategory?: string;
  availableSizes: string[];
}) {
  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  const sizes = SIZE_ORDER.filter((s) => availableSizes.includes(s));

  return (
    <div>
      <Group title="Refine">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["new", "New in"],
              ["bestsellers", "Best sellers"],
              ["sale", "On sale"],
            ] as const
          ).map(([value, label]) => {
            const active = state.quick === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => update({ quick: active ? null : value })}
                className={cn(
                  "h-9 rounded-full border px-4 text-[13px] transition-colors",
                  active ? "border-ink bg-ink text-paper" : "border-line-strong hover:border-ink",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </Group>

      {!lockedCategory && (
        <Group title="Category">
          <div className="space-y-3">
            {categories.map((c) => (
              <Checkbox
                key={c.slug}
                label={c.name}
                checked={state.categories.includes(c.slug)}
                onChange={() => update({ categories: toggle(state.categories, c.slug) })}
              />
            ))}
          </div>
        </Group>
      )}

      {sizes.length > 0 && (
        <Group title="Size">
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = state.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  aria-pressed={active}
                  onClick={() => update({ sizes: toggle(state.sizes, size) })}
                  className={cn(
                    "h-10 min-w-11 rounded-lg border px-3 text-[13px] font-medium tabular-nums transition-colors",
                    active ? "border-ink bg-ink text-paper" : "border-line-strong hover:border-ink",
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </Group>
      )}

      <Group title="Price">
        <div className="space-y-2.5">
          {PRICE_PRESETS.map((p) => {
            const active = state.minPrice === p.min && state.maxPrice === p.max;
            return (
              <button
                key={p.label}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  update(active ? { minPrice: null, maxPrice: null } : { minPrice: p.min, maxPrice: p.max })
                }
                className="flex w-full items-center gap-3 text-left text-sm text-ink-soft"
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border transition-colors",
                    active ? "border-ink" : "border-line-strong",
                  )}
                >
                  {active && <span className="size-2.5 rounded-full bg-ink" />}
                </span>
                <span className="tabular-nums">{p.label}</span>
              </button>
            );
          })}
        </div>
        <PriceInputs key={`${state.minPrice}-${state.maxPrice}`} state={state} update={update} />
      </Group>

      <Group title="Availability">
        <Checkbox
          label="In stock only"
          description="Hide pieces that are sold out"
          checked={state.inStockOnly}
          onChange={(e) => update({ inStockOnly: e.target.checked })}
        />
      </Group>
    </div>
  );
}
