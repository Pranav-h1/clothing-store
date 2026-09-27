import { business } from "@/config/business";

export function shippingFee(subtotal: number): number {
  if (subtotal === 0) return 0;
  const threshold = business.shipping.freeShippingThreshold;
  return threshold !== null && subtotal >= threshold ? 0 : business.shipping.flatRate;
}

/** How much more the customer needs to spend for free shipping, or `null`. */
export function amountToFreeShipping(subtotal: number): number | null {
  const threshold = business.shipping.freeShippingThreshold;
  if (threshold === null || subtotal >= threshold) return null;
  return threshold - subtotal;
}

/** Convert a display amount to the gateway's smallest unit (e.g. paise). */
export function toMinorUnits(amount: number): number {
  return Math.round(amount * business.currency.minorUnit);
}
