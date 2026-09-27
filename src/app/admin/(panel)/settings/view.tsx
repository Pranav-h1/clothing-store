"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Badge, Notice } from "@/components/ui/misc";
import { Sheet } from "@/components/ui/sheet";
import { business } from "@/config/business";
import { formatPrice } from "@/lib/format";
import { resetCatalog } from "@/lib/stores/catalog";
import { resetOrders } from "@/lib/stores/orders";
import { toast } from "@/lib/stores/ui";

function Group({ title, rows }: { title: string; rows: [string, React.ReactNode][] }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="mb-4 text-base font-medium">{title}</h2>
      <dl className="divide-y divide-line text-sm">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:justify-between sm:gap-6"
          >
            <dt className="text-muted">{k}</dt>
            <dd className="break-words sm:text-right">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const MODE_COPY = {
  demo: {
    label: "Demo (simulated)",
    tone: "warning",
    body: "No Razorpay keys configured — checkout simulates payment.",
  },
  test: { label: "Razorpay test mode", tone: "info", body: "Using rzp_test keys. No real money is charged." },
  live: { label: "Live payments", tone: "success", body: "Using live Razorpay keys. Real payments are accepted." },
} as const;

export default function AdminSettingsPage() {
  const [mode, setMode] = useState<keyof typeof MODE_COPY | null>(null);
  const [confirm, setConfirm] = useState<"catalog" | "orders" | null>(null);

  useEffect(() => {
    fetch("/api/checkout")
      .then((r) => r.json())
      .then((d) => setMode(d.mode))
      .catch(() => setMode("demo"));
  }, []);

  const { brand, contact, currency, shipping, locale } = business;
  const threshold = shipping.freeShippingThreshold;

  return (
    <>
      <AdminPageHeader title="Settings" description="Store configuration and payment status." />
      <Notice tone="info" className="mb-5" title="Where to change these">
        Business details live in <code className="rounded bg-white/60 px-1">src/config/business.ts</code> and payment
        keys in
        <code className="mx-1 rounded bg-white/60 px-1">.env.local</code>. They&rsquo;re read-only here so secrets never
        reach the browser.
      </Notice>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-medium">Payments</h2>
            {mode && <Badge tone={MODE_COPY[mode].tone}>{MODE_COPY[mode].label}</Badge>}
          </div>
          <p className="mt-2 text-sm text-muted">{mode ? MODE_COPY[mode].body : "Checking payment configuration…"}</p>
          <p className="mt-3 text-[13px] text-muted">
            Webhook endpoint: <code className="rounded bg-sand px-1.5 py-0.5">/api/webhooks/razorpay</code>
          </p>
        </section>

        <Group
          title="Brand"
          rows={[
            ["Store name", brand.name],
            ["Tagline", brand.tagline],
            ["Logo", brand.logo ?? "Text wordmark (no logo file set)"],
            ["Demo mode", business.isDemo ? "On" : "Off"],
          ]}
        />
        <Group
          title="Contact"
          rows={[
            ["Email", contact.email],
            ["Phone", contact.phone.display],
            ["WhatsApp", contact.whatsapp.display],
            ["Hours", contact.hours],
          ]}
        />
        <Group
          title="Region & currency"
          rows={[
            ["Country", locale.country],
            ["Currency", `${currency.code} (${currency.symbol})`],
            ["Number locale", locale.language],
          ]}
        />
        <Group
          title="Shipping"
          rows={[
            ["Flat rate", formatPrice(shipping.flatRate)],
            ["Free shipping over", threshold === null ? "Disabled" : formatPrice(threshold)],
            ["Dispatch estimate", shipping.estimate],
          ]}
        />

        <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6 lg:col-span-2">
          <h2 className="text-base font-medium">Demo data</h2>
          <p className="mt-1 text-sm text-muted">
            Restore the sample catalog or clear test orders placed in this browser.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setConfirm("catalog")}>
              Reset products & stock
            </Button>
            <Button variant="outline" onClick={() => setConfirm("orders")}>
              Clear test orders
            </Button>
          </div>
        </section>
      </div>

      <Sheet
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        title={confirm === "catalog" ? "Reset products?" : "Clear test orders?"}
        side="center"
        className="max-w-md"
      >
        <div className="px-6 pb-6">
          <p className="text-[15px] leading-relaxed text-muted">
            {confirm === "catalog"
              ? "All product edits, new products and stock changes made in this browser will be discarded."
              : "Orders placed in this browser and status changes will be removed. Sample orders stay."}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm === "catalog") resetCatalog();
                else resetOrders();
                toast({ tone: "success", title: confirm === "catalog" ? "Catalog restored" : "Test orders cleared" });
                setConfirm(null);
              }}
            >
              {confirm === "catalog" ? "Reset" : "Clear"}
            </Button>
          </div>
        </div>
      </Sheet>
    </>
  );
}
