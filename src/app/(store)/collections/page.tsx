import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/misc";
import { SmartImage } from "@/components/ui/smart-image";
import { categories } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore every collection in the store.",
};

export default function CollectionsPage() {
  return (
    <div className="container-page pt-10 pb-20 sm:pt-14">
      <SectionHeading
        as="h1"
        eyebrow="Collections"
        title="Find your next favourite"
        body="Every piece in the store, grouped the way you shop."
      />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {categories.map((c, i) => (
          <li key={c.slug}>
            <Link href={`/collections/${c.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <SmartImage
                  src={c.image.src}
                  alt={c.image.alt}
                  fill
                  priority={i < 3}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-(--ease-out-soft) group-hover:scale-[1.04]"
                />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl">{c.name}</h2>
                  <p className="mt-1 text-sm text-muted">{c.description}</p>
                </div>
                <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                  <Icon name="arrow-right" size={17} />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
