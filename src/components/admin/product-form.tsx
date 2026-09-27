"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { categories } from "@/data/catalog";
import { cn } from "@/lib/format";
import { saveProduct, useProducts } from "@/lib/stores/catalog";
import { toast } from "@/lib/stores/ui";
import type { Audience, ImageAsset, Product, ProductColor } from "@/lib/types";
import { Button } from "../ui/button";
import { Checkbox, Input, Select, Textarea } from "../ui/field";
import { Icon } from "../ui/icon";
import { Notice } from "../ui/misc";
import { SmartImage } from "../ui/smart-image";

const SIZE_PRESETS: Record<string, string[]> = {
  "Women XS–XL": ["XS", "S", "M", "L", "XL"],
  "Men S–XXL": ["S", "M", "L", "XL", "XXL"],
  "Waist 26–34": ["26", "28", "30", "32", "34"],
  "One size": ["One Size"],
};

type Draft = {
  name: string;
  slug: string;
  sku: string;
  description: string;
  highlights: string;
  category: string;
  audience: Audience;
  price: string;
  compareAtPrice: string;
  images: ImageAsset[];
  sizes: string[];
  stock: Record<string, string>;
  colors: ProductColor[];
  material: string;
  care: string;
  featured: boolean;
  isNew: boolean;
  bestseller: boolean;
};

type ErrorKey = "name" | "slug" | "sku" | "description" | "price" | "compareAtPrice" | "images" | "sizes" | "colors";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");

function toDraft(p?: Product): Draft {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    sku: p?.sku ?? "",
    description: p?.description ?? "",
    highlights: p?.highlights.join("\n") ?? "",
    category: p?.category ?? categories[0].slug,
    audience: p?.audience ?? "women",
    price: p ? String(p.price) : "",
    compareAtPrice: p?.compareAtPrice ? String(p.compareAtPrice) : "",
    images: p?.images ?? [{ src: "", alt: "" }],
    sizes: p?.sizes ?? SIZE_PRESETS["Women XS–XL"],
    stock: Object.fromEntries((p?.sizes ?? SIZE_PRESETS["Women XS–XL"]).map((s) => [s, String(p?.stock[s] ?? 0)])),
    colors: p?.colors ?? [{ name: "", hex: "#d9ccb8" }],
    material: p?.material ?? "",
    care: p?.care.join("\n") ?? "",
    featured: p?.featured ?? false,
    isNew: p?.isNew ?? true,
    bestseller: p?.bestseller ?? false,
  };
}

const lines = (s: string) =>
  s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <h2 className="text-base font-medium">{title}</h2>
      {description && <p className="mt-1 text-[13px] text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const products = useProducts();
  const [draft, setDraft] = useState<Draft>(() => toDraft(product));
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const field = (
    key: "name" | "sku" | "description" | "material" | "price" | "compareAtPrice" | "highlights" | "care",
  ) => ({
    value: draft[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setDraft((d) => ({
        ...d,
        [key]: value,
        ...(key === "name" && !slugTouched ? { slug: slugify(value) } : {}),
      }));
    },
    error: errors[key as ErrorKey],
  });

  const setSizes = (sizes: string[]) =>
    setDraft((d) => ({ ...d, sizes, stock: Object.fromEntries(sizes.map((s) => [s, d.stock[s] ?? "0"])) }));

  function validate(): boolean {
    const e: Partial<Record<ErrorKey, string>> = {};
    if (!draft.name.trim()) e.name = "Enter a product name.";
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(draft.slug)) e.slug = "Use lowercase letters, numbers and hyphens.";
    else if (products.some((p) => p.slug === draft.slug && p.id !== product?.id))
      e.slug = "Another product uses this URL.";
    if (!draft.sku.trim()) e.sku = "Enter a SKU.";
    else if (products.some((p) => p.sku === draft.sku.trim() && p.id !== product?.id))
      e.sku = "This SKU is already in use.";
    if (draft.description.trim().length < 20) e.description = "Write at least a short sentence (20+ characters).";
    const price = Number(draft.price);
    if (!draft.price || !Number.isFinite(price) || price <= 0) e.price = "Enter a price above 0.";
    if (draft.compareAtPrice && !(Number(draft.compareAtPrice) > price))
      e.compareAtPrice = "Must be higher than the price, or leave empty.";
    if (!draft.images.some((i) => /^(https?:\/\/|\/)/.test(i.src.trim())))
      e.images = "Add at least one image URL (https://… or /path-in-public).";
    if (draft.sizes.length === 0) e.sizes = "Add at least one size.";
    if (!draft.colors.some((c) => c.name.trim())) e.colors = "Name at least one colour.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!validate()) {
      toast({ tone: "error", title: "Please fix the highlighted fields" });
      return;
    }
    setSaving(true);
    const saved: Product = {
      id: product?.id ?? `p-${Date.now().toString(36)}`,
      slug: draft.slug,
      sku: draft.sku.trim(),
      name: draft.name.trim(),
      description: draft.description.trim(),
      highlights: lines(draft.highlights),
      category: draft.category,
      audience: draft.audience,
      price: Number(draft.price),
      compareAtPrice: draft.compareAtPrice ? Number(draft.compareAtPrice) : null,
      images: draft.images
        .filter((i) => i.src.trim())
        .map((i) => ({ src: i.src.trim(), alt: i.alt.trim() || draft.name.trim() })),
      sizes: draft.sizes,
      colors: draft.colors.filter((c) => c.name.trim()).map((c) => ({ name: c.name.trim(), hex: c.hex })),
      stock: Object.fromEntries(draft.sizes.map((s) => [s, Math.max(0, Math.floor(Number(draft.stock[s]) || 0))])),
      material: draft.material.trim(),
      care: lines(draft.care),
      featured: draft.featured,
      isNew: draft.isNew,
      bestseller: draft.bestseller,
      createdAt: product?.createdAt ?? new Date().toISOString().slice(0, 10),
    };
    saveProduct(saved);
    toast({ tone: "success", title: product ? "Product updated" : "Product created", description: saved.name });
    router.push("/admin/products");
  }

  return (
    <form onSubmit={submit} noValidate className="grid items-start gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Section title="Basics">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Product name" wrapperClassName="sm:col-span-2" {...field("name")} />
            <Input
              label="URL slug"
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              error={errors.slug}
              hint={`/products/${draft.slug || "…"}`}
            />
            <Input label="SKU" {...field("sku")} />
            <Textarea label="Description" wrapperClassName="sm:col-span-2" {...field("description")} />
            <Textarea
              label="Highlights"
              optional
              hint="One per line — shown as bullets on the product page."
              wrapperClassName="sm:col-span-2"
              className="min-h-24"
              {...field("highlights")}
            />
          </div>
        </Section>

        <Section
          title="Images"
          description="Paste image URLs. Production should upload to storage (e.g. S3, Cloudinary) instead."
        >
          <div className="space-y-3">
            {draft.images.map((img, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="relative mt-6 h-16 w-13 shrink-0 overflow-hidden rounded-lg bg-sand">
                  {/^(https?:\/\/|\/)/.test(img.src) && (
                    <SmartImage key={img.src} src={img.src} alt="" fill sizes="52px" className="object-cover" />
                  )}
                </span>
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <Input
                    label={`Image ${i + 1} URL`}
                    value={img.src}
                    placeholder="https://…"
                    onChange={(e) =>
                      set(
                        "images",
                        draft.images.map((x, j) => (j === i ? { ...x, src: e.target.value } : x)),
                      )
                    }
                  />
                  <Input
                    label="Alt text"
                    value={img.alt}
                    placeholder="Describe the photo"
                    onChange={(e) =>
                      set(
                        "images",
                        draft.images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)),
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  disabled={draft.images.length === 1}
                  onClick={() =>
                    set(
                      "images",
                      draft.images.filter((_, j) => j !== i),
                    )
                  }
                  className="mt-7 flex size-10 shrink-0 items-center justify-center rounded-full text-muted hover:bg-danger-soft hover:text-danger disabled:opacity-30"
                  aria-label={`Remove image ${i + 1}`}
                >
                  <Icon name="trash" size={17} />
                </button>
              </div>
            ))}
            {errors.images && <p className="text-[13px] text-danger">{errors.images}</p>}
            <Button variant="outline" size="sm" onClick={() => set("images", [...draft.images, { src: "", alt: "" }])}>
              <Icon name="plus" size={15} /> Add image
            </Button>
          </div>
        </Section>

        <Section title="Sizes & stock" description="Stock is tracked per size.">
          <div className="flex flex-wrap gap-2">
            {Object.entries(SIZE_PRESETS).map(([label, sizes]) => {
              const active = sizes.join() === draft.sizes.join();
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSizes(sizes)}
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
          {errors.sizes && <p className="mt-2 text-[13px] text-danger">{errors.sizes}</p>}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {draft.sizes.map((size) => (
              <Input
                key={size}
                label={`${size} stock`}
                type="number"
                inputMode="numeric"
                min={0}
                value={draft.stock[size] ?? "0"}
                onChange={(e) => setDraft((d) => ({ ...d, stock: { ...d.stock, [size]: e.target.value } }))}
              />
            ))}
          </div>
        </Section>

        <Section title="Colours">
          <div className="space-y-3">
            {draft.colors.map((color, i) => (
              <div key={i} className="flex items-end gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-medium text-ink-soft">Swatch</span>
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) =>
                      set(
                        "colors",
                        draft.colors.map((x, j) => (j === i ? { ...x, hex: e.target.value } : x)),
                      )
                    }
                    className="h-12 w-14 cursor-pointer rounded-xl border border-line-strong bg-surface p-1"
                    aria-label={`Colour ${i + 1} swatch`}
                  />
                </label>
                <Input
                  label={`Colour ${i + 1} name`}
                  value={color.name}
                  placeholder="e.g. Oat"
                  wrapperClassName="flex-1"
                  onChange={(e) =>
                    set(
                      "colors",
                      draft.colors.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)),
                    )
                  }
                />
                <button
                  type="button"
                  disabled={draft.colors.length === 1}
                  onClick={() =>
                    set(
                      "colors",
                      draft.colors.filter((_, j) => j !== i),
                    )
                  }
                  className="flex size-12 shrink-0 items-center justify-center rounded-full text-muted hover:bg-danger-soft hover:text-danger disabled:opacity-30"
                  aria-label={`Remove colour ${i + 1}`}
                >
                  <Icon name="trash" size={17} />
                </button>
              </div>
            ))}
            {errors.colors && <p className="text-[13px] text-danger">{errors.colors}</p>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => set("colors", [...draft.colors, { name: "", hex: "#cccccc" }])}
            >
              <Icon name="plus" size={15} /> Add colour
            </Button>
          </div>
        </Section>

        <Section title="Material & care">
          <div className="grid gap-4">
            <Input label="Material" placeholder="e.g. 100% organic cotton" {...field("material")} />
            <Textarea label="Care instructions" hint="One per line." className="min-h-24" {...field("care")} />
          </div>
        </Section>
      </div>

      <div className="space-y-5 lg:sticky lg:top-8">
        <Section title="Pricing">
          <div className="grid gap-4">
            <Input label="Price" type="number" inputMode="decimal" min={0} {...field("price")} />
            <Input
              label="Compare-at price"
              optional
              type="number"
              inputMode="decimal"
              min={0}
              hint="Shows as a sale."
              {...field("compareAtPrice")}
            />
          </div>
        </Section>
        <Section title="Organisation">
          <div className="grid gap-4">
            <Select label="Category" value={draft.category} onChange={(e) => set("category", e.target.value)}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </Select>
            <Select
              label="Audience"
              value={draft.audience}
              onChange={(e) => set("audience", e.target.value as Audience)}
            >
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="unisex">Unisex</option>
            </Select>
            <div className="space-y-3 pt-1">
              <Checkbox
                label="Featured"
                description="Shown in Featured pieces on the home page"
                checked={draft.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              <Checkbox label="New arrival" checked={draft.isNew} onChange={(e) => set("isNew", e.target.checked)} />
              <Checkbox
                label="Best seller"
                checked={draft.bestseller}
                onChange={(e) => set("bestseller", e.target.checked)}
              />
            </div>
          </div>
        </Section>
        <Notice tone="warning" icon="info">
          Demo: saved to this browser only. Production saves through an authenticated admin API.
        </Notice>
        <div className="flex gap-3">
          <Button type="submit" size="lg" className="flex-1" loading={saving}>
            {product ? "Save changes" : "Create product"}
          </Button>
          <Link
            href="/admin/products"
            className="inline-flex h-13 items-center rounded-full px-5 text-sm hover:bg-sand"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
