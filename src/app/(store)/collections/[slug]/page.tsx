import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ShopSkeleton } from "@/components/shop/shop-skeleton";
import { ShopView } from "@/components/shop/shop-view";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SmartImage } from "@/components/ui/smart-image";
import { categories } from "@/data/catalog";
import { getCategory } from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const category = getCategory((await params).slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const category = getCategory((await params).slug);
  if (!category) notFound();

  return (
    <>
      <section className="container-page pt-4 sm:pt-6">
        <Breadcrumbs
          className="mb-4"
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/collections" },
            { label: category.name },
          ]}
        />
        <div className="relative h-56 overflow-hidden rounded-3xl sm:h-72 lg:h-80">
          <SmartImage
            src={category.image.src}
            alt={category.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
          <div className="absolute inset-y-0 left-0 flex max-w-lg flex-col justify-end p-6 text-white sm:p-10">
            <p className="eyebrow text-white/75">Collection</p>
            <h1 className="mt-2 font-display text-5xl leading-none sm:text-6xl">{category.name}</h1>
            <p className="mt-3 text-[15px] text-white/85">{category.description}</p>
          </div>
        </div>
      </section>
      <Suspense fallback={<ShopSkeleton />}>
        <ShopView lockedCategory={category.slug} />
      </Suspense>
    </>
  );
}
