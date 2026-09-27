import { twMerge } from "tailwind-merge";
import { business } from "@/config/business";

const numberFormat = new Intl.NumberFormat(business.locale.language, {
  minimumFractionDigits: business.currency.fractionDigits,
  maximumFractionDigits: business.currency.fractionDigits,
});

/** Format an amount in the store currency, e.g. "¤ 4,290". */
export function formatPrice(amount: number): string {
  return `${business.currency.symbol} ${numberFormat.format(amount)}`;
}

const dateFormat = new Intl.DateTimeFormat(business.locale.language, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

/** Joins class names; later Tailwind utilities override conflicting earlier ones. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return twMerge(classes.filter(Boolean).join(" "));
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
