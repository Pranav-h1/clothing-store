"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SummaryRows } from "@/components/checkout/order-summary";
import { Button, ButtonLink } from "@/components/ui/button";
import { Checkbox, Input, Select } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { EmptyState, Notice, Skeleton } from "@/components/ui/misc";
import { Sheet } from "@/components/ui/sheet";
import { SmartImage } from "@/components/ui/smart-image";
import { Spinner } from "@/components/ui/spinner";
import { business } from "@/config/business";
import { updateProfile, useCurrentUser } from "@/lib/auth/customer-auth";
import { cn, formatPrice } from "@/lib/format";
import { createCheckoutSession, payWithRazorpay, type CheckoutSession } from "@/lib/payments/checkout-client";
import { placeOrder } from "@/lib/place-order";
import { useCart } from "@/lib/stores/cart";
import { useHydrated } from "@/lib/stores/persistent-store";
import type { Address } from "@/lib/types";
import { collectErrors, validateEmail, validatePhone, validateRequired, type FieldErrors } from "@/lib/validation";

type FormState = Address & { email: string; saveAddress: boolean };
type FieldKey = "email" | "fullName" | "phone" | "line1" | "city" | "region" | "postalCode";

const EMPTY: FormState = {
  email: "",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postalCode: "",
  country: business.locale.country,
  saveAddress: true,
};

function validate(f: FormState): FieldErrors<FieldKey> {
  return collectErrors<FieldKey>({
    email: validateEmail(f.email),
    fullName: validateRequired(f.fullName, "your full name"),
    phone: validatePhone(f.phone),
    line1: validateRequired(f.line1, "your street address"),
    city: validateRequired(f.city, "your city"),
    region: validateRequired(f.region, "your state or region"),
    postalCode: validateRequired(f.postalCode, "your postal code"),
  });
}

function Step({
  n,
  title,
  children,
  aside,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`step-${n}`} className="border-b border-line py-8 first:pt-0 last:border-b-0">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 id={`step-${n}`} className="flex items-center gap-3 text-lg font-medium">
          <span className="flex size-7 items-center justify-center rounded-full bg-ink text-[13px] text-paper">
            {n}
          </span>
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function CheckoutView() {
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const cart = useCart();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [prefilledFor, setPrefilledFor] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors<FieldKey>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [mode, setMode] = useState<CheckoutSession["mode"] | null>(null);
  const [demoSession, setDemoSession] = useState<CheckoutSession | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Prefill from the signed-in account once.
  if (user && prefilledFor !== user.id) {
    setPrefilledFor(user.id);
    setForm((f) => ({
      ...f,
      email: f.email || user.email,
      fullName: f.fullName || user.address?.fullName || user.name,
      phone: f.phone || user.address?.phone || user.phone,
      ...(user.address && !f.line1 ? { ...user.address, country: business.locale.country } : {}),
    }));
  }

  useEffect(() => {
    fetch("/api/checkout")
      .then((r) => r.json())
      .then((d) => setMode(d.mode))
      .catch(() => setMode("demo"));
  }, []);

  const set =
    <K extends keyof FormState>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = (
        e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value
      ) as FormState[K];
      setForm((f) => ({ ...f, [key]: value }));
      if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-12" aria-busy="true" aria-label="Loading checkout">
        <div className="space-y-4 lg:col-span-7">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
        <Skeleton className="h-96 rounded-3xl lg:col-span-5" />
      </div>
    );
  }

  if (confirming) {
    return (
      <div role="status" className="flex flex-col items-center py-24 text-center">
        <Spinner className="size-8 border-[3px]" />
        <p className="mt-5 font-display text-3xl">Confirming your order…</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <EmptyState
        icon="bag"
        title="Nothing to check out"
        body="Your bag is empty. Add a few pieces and come back."
        action={<ButtonLink href="/shop">Continue shopping</ButtonLink>}
      />
    );
  }

  const customer = { name: form.fullName.trim(), email: form.email.trim(), phone: form.phone.trim() };
  const address: Address = {
    fullName: form.fullName.trim(),
    phone: form.phone.trim(),
    line1: form.line1.trim(),
    line2: form.line2.trim(),
    city: form.city.trim(),
    region: form.region.trim(),
    postalCode: form.postalCode.trim(),
    country: form.country,
  };

  function complete(
    session: CheckoutSession,
    payment: { mode: "demo" | "test" | "live"; paymentId?: string; gatewayOrderId?: string },
  ) {
    setConfirming(true);
    if (user && form.saveAddress) updateProfile({ address });
    const order = placeOrder({
      items: cart.items,
      customer,
      shippingAddress: address,
      subtotal: session.subtotal,
      shippingFee: session.shipping,
      total: session.total,
      payment: { provider: "razorpay", ...payment },
    });
    router.push(`/checkout/success?order=${encodeURIComponent(order.id)}`);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    const problems = validate(form);
    setErrors(problems);
    const firstInvalid = Object.keys(problems)[0];
    if (firstInvalid) {
      document.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    if (cart.hasStockIssue) {
      setFormError("Some items in your bag exceed available stock. Please update your bag.");
      return;
    }

    setSubmitting(true);
    try {
      const session = await createCheckoutSession({
        items: cart.items.map((i) => ({
          productId: i.productId,
          size: i.size,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
        customer,
      });
      if (session.mode === "demo") {
        setDemoSession(session);
        return;
      }
      const result = await payWithRazorpay(session, customer);
      complete(session, { mode: session.mode, ...result });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const summary = (
    <>
      <ul className="space-y-4">
        {cart.items.map((item) => (
          <li key={item.key} className="flex items-center gap-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-sand">
              <SmartImage src={item.product.images[0].src} alt="" fill sizes="64px" className="object-cover" />
              <span className="absolute top-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-medium text-paper">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.product.name}</p>
              <p className="text-[13px] text-muted">
                {item.color} · {item.size}
              </p>
            </div>
            <p className="text-sm tabular-nums">{formatPrice(item.lineTotal)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-line pt-6">
        <SummaryRows subtotal={cart.subtotal} shipping={cart.shipping} total={cart.total} itemCount={cart.count} />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile: collapsible order summary */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-line bg-surface lg:hidden">
        <button
          type="button"
          onClick={() => setSummaryOpen((o) => !o)}
          aria-expanded={summaryOpen}
          aria-controls="mobile-summary"
          className="flex w-full items-center justify-between gap-3 p-4 text-sm"
        >
          <span className="flex items-center gap-2 font-medium">
            <Icon name="bag" size={18} />
            {summaryOpen ? "Hide" : "Show"} order summary
            <Icon name="chevron-down" size={16} className={cn("transition-transform", summaryOpen && "rotate-180")} />
          </span>
          <span className="text-base font-medium tabular-nums">{formatPrice(cart.total)}</span>
        </button>
        <div id="mobile-summary" hidden={!summaryOpen} className="border-t border-line p-4">
          {summary}
        </div>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <form onSubmit={submit} noValidate className="lg:col-span-7">
          <Step
            n={1}
            title="Contact"
            aside={
              !user && (
                <p className="text-[13px] text-muted">
                  Have an account?{" "}
                  <Link href="/login?next=/checkout" className="font-medium text-ink underline underline-offset-4">
                    Sign in
                  </Link>
                </p>
              )
            }
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
                hint="For your order confirmation"
                wrapperClassName="sm:col-span-2"
              />
              <Input
                label="Full name"
                name="fullName"
                autoComplete="name"
                value={form.fullName}
                onChange={set("fullName")}
                error={errors.fullName}
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+XX XXXXX XXXXX"
                value={form.phone}
                onChange={set("phone")}
                error={errors.phone}
                hint="For delivery updates"
              />
            </div>
          </Step>

          <Step n={2} title="Shipping address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Address"
                name="line1"
                autoComplete="address-line1"
                placeholder="House number and street"
                value={form.line1}
                onChange={set("line1")}
                error={errors.line1}
                wrapperClassName="sm:col-span-2"
              />
              <Input
                label="Apartment, suite, landmark"
                name="line2"
                optional
                autoComplete="address-line2"
                value={form.line2}
                onChange={set("line2")}
                wrapperClassName="sm:col-span-2"
              />
              <Input
                label="City"
                name="city"
                autoComplete="address-level2"
                value={form.city}
                onChange={set("city")}
                error={errors.city}
              />
              <Input
                label="State / Region"
                name="region"
                autoComplete="address-level1"
                value={form.region}
                onChange={set("region")}
                error={errors.region}
              />
              <Input
                label="Postal code"
                name="postalCode"
                autoComplete="postal-code"
                inputMode="numeric"
                value={form.postalCode}
                onChange={set("postalCode")}
                error={errors.postalCode}
              />
              <Select
                label="Country"
                name="country"
                value={form.country}
                onChange={set("country")}
                hint="Set the shipping country in config"
              >
                <option value={business.locale.country}>{business.locale.country}</option>
              </Select>
              {user && (
                <Checkbox
                  label="Save this address to my account"
                  checked={form.saveAddress}
                  onChange={set("saveAddress")}
                  className="sm:col-span-2"
                />
              )}
            </div>
          </Step>

          <Step n={3} title="Delivery">
            <div className="flex items-center gap-4 rounded-2xl border-2 border-ink bg-surface p-4">
              <span className="flex size-5 items-center justify-center rounded-full border-2 border-ink">
                <span className="size-2.5 rounded-full bg-ink" />
              </span>
              <div className="flex-1">
                <p className="text-[15px] font-medium">Standard delivery</p>
                <p className="text-[13px] text-muted">{business.shipping.estimate}</p>
              </div>
              <p className={cn("text-[15px] font-medium tabular-nums", cart.shipping === 0 && "text-success")}>
                {cart.shipping === 0 ? "Free" : formatPrice(cart.shipping)}
              </p>
            </div>
          </Step>

          <Step n={4} title="Payment">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sand">
                  <Icon name="card" size={22} />
                </span>
                <div>
                  <p className="text-[15px] font-medium">Pay securely with Razorpay</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
                    Cards, UPI, net banking and wallets. You&rsquo;ll complete payment in a secure Razorpay window —
                    card details never touch this site.
                  </p>
                </div>
              </div>
              {mode === "demo" && (
                <Notice tone="warning" icon="info" title="Demo mode — no real payment" className="mt-5">
                  Razorpay keys aren&rsquo;t configured, so payment is simulated and no money moves. Add test keys in
                  <code className="mx-1 rounded bg-white/60 px-1">.env.local</code>to use Razorpay test mode.
                </Notice>
              )}
              {mode === "test" && (
                <Notice tone="info" icon="info" title="Razorpay test mode" className="mt-5">
                  Use Razorpay test cards or UPI IDs. No real money is charged.
                </Notice>
              )}
            </div>
          </Step>

          {formError && (
            <Notice tone="danger" icon="alert" className="mb-4" title="We couldn't place your order">
              <span role="alert">{formError}</span>
            </Notice>
          )}

          <Button
            type="submit"
            size="lg"
            className="h-14 w-full text-base"
            loading={submitting}
            disabled={mode === null}
          >
            <Icon name="lock" size={18} /> Pay {formatPrice(cart.total)}
          </Button>
          <p className="mt-4 text-center text-[12px] leading-relaxed text-muted">
            By placing your order you agree to the store&rsquo;s terms and returns policy (placeholders).
          </p>
        </form>

        <aside className="hidden lg:sticky lg:top-28 lg:col-span-5 lg:block">
          <div className="rounded-3xl border border-line bg-surface p-7">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-display text-3xl">Order summary</h2>
              <Link href="/cart" className="text-[13px] text-muted underline underline-offset-4 hover:text-ink">
                Edit bag
              </Link>
            </div>
            {summary}
          </div>
        </aside>
      </div>

      {/* Demo payment simulator (only when no Razorpay keys are configured) */}
      <Sheet
        open={demoSession !== null}
        onClose={() => setDemoSession(null)}
        title="Demo payment"
        side="center"
        className="max-w-md"
      >
        <div className="px-6 pb-6">
          <div className="rounded-2xl bg-paper p-5 text-center">
            <p className="text-[13px] text-muted">Amount</p>
            <p className="mt-1 text-3xl font-medium tabular-nums">{demoSession && formatPrice(demoSession.total)}</p>
            <p className="mt-2 text-[13px] text-muted">{business.brand.name}</p>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            This stands in for the Razorpay window. Choose an outcome to see how the store handles it — no money moves.
          </p>
          <div className="mt-6 grid gap-3">
            <Button
              size="lg"
              onClick={() => {
                const session = demoSession!;
                setDemoSession(null);
                complete(session, { mode: "demo", paymentId: `demo_pay_${Date.now().toString(36)}` });
              }}
            >
              <Icon name="check" size={18} /> Simulate successful payment
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setDemoSession(null);
                setFormError("The payment was declined (simulated). No money was taken — you can try again.");
              }}
            >
              Simulate failed payment
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  );
}
