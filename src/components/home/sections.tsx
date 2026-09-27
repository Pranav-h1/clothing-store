import Link from "next/link";
import { business } from "@/config/business";
import { homeContent } from "@/content/pages";
import { categories } from "@/data/catalog";
import { cn } from "@/lib/format";
import { ContactAction } from "../contact-actions";
import { NewsletterForm } from "../newsletter-form";
import { ButtonLink } from "../ui/button";
import { Icon, type IconName } from "../ui/icon";
import { SectionHeading } from "../ui/misc";
import { SmartImage } from "../ui/smart-image";

export function Hero() {
  const { hero } = homeContent;
  return (
    <section className="container-page pt-4 pb-14 sm:pt-6 lg:pb-20">
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="order-2 lg:order-1 lg:col-span-5 lg:py-16">
          <p className="animate-rise eyebrow text-muted">{hero.eyebrow}</p>
          <h1 className="mt-4 animate-rise font-display text-[3.25rem] leading-[0.95] [animation-delay:60ms] sm:text-7xl xl:text-[5.75rem]">
            {hero.title} <em className="text-ink-soft">{hero.titleAccent}</em>
          </h1>
          <p className="mt-6 max-w-md animate-rise text-base leading-relaxed text-muted [animation-delay:120ms] sm:text-lg">
            {hero.body}
          </p>
          <div className="mt-8 flex animate-rise flex-col gap-3 [animation-delay:180ms] sm:flex-row">
            <ButtonLink href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
              <Icon name="arrow-right" size={17} />
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} size="lg" variant="outline">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <div className="relative order-1 lg:order-2 lg:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[16/12] lg:aspect-auto lg:h-[min(80svh,54rem)] lg:min-h-[34rem]">
            <SmartImage
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden w-[34%] overflow-hidden rounded-2xl border-[6px] border-paper shadow-lift xl:block">
            <div className="relative aspect-[3/4]">
              <SmartImage
                src={hero.secondaryImage.src}
                alt={hero.secondaryImage.alt}
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-4 rounded-2xl p-4 shadow-soft glass sm:right-5 sm:bottom-5 sm:left-auto sm:w-72">
            <div>
              <p className="text-[13px] font-medium">New season edit</p>
              <p className="text-[12px] text-muted">Fresh arrivals every week</p>
            </div>
            <Link
              href="/shop?filter=new"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-transform hover:scale-105"
              aria-label="Shop new arrivals"
            >
              <Icon name="arrow-right" size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CollectionsGrid() {
  return (
    <section className="py-14 sm:py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Featured collections"
          title="Shop by category"
          action={
            <span className="hidden sm:block">
              <ButtonLink href="/collections" variant="outline" size="sm">
                All collections <Icon name="arrow-right" size={15} />
              </ButtonLink>
            </span>
          }
        />
        <ul className="-mx-5 mt-8 scrollbar-none flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-4 sm:gap-5 sm:overflow-visible sm:px-0">
          {categories.slice(0, 6).map((c, i) => (
            <li
              key={c.slug}
              className={cn(
                "w-[62vw] max-w-[18rem] shrink-0 snap-start sm:w-auto sm:max-w-none",
                i < 2 && "sm:col-span-2 sm:row-span-2",
              )}
            >
              <Link
                href={`/collections/${c.slug}`}
                className={cn(
                  "group relative block aspect-[3/4] overflow-hidden rounded-2xl",
                  i < 2 && "sm:aspect-auto sm:h-full sm:min-h-[26rem]",
                )}
              >
                <SmartImage
                  src={c.image.src}
                  alt={c.image.alt}
                  fill
                  sizes={i < 2 ? "(min-width: 640px) 45vw, 62vw" : "(min-width: 640px) 22vw, 62vw"}
                  className="object-cover transition-transform duration-[900ms] ease-(--ease-out-soft) group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div>
                    <h3 className={cn("font-display text-white", i < 2 ? "text-3xl sm:text-4xl" : "text-2xl")}>
                      {c.name}
                    </h3>
                    {i < 2 && <p className="mt-1 hidden max-w-xs text-sm text-white/80 sm:block">{c.description}</p>}
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-ink transition-transform duration-300 group-hover:translate-x-0.5">
                    <Icon name="arrow-right" size={17} />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function PromoBanner() {
  const { promo } = homeContent;
  return (
    <section className="container-page py-8 sm:py-12">
      <div className="relative isolate overflow-hidden rounded-3xl bg-sand sm:bg-transparent">
        <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
          <SmartImage src={promo.image.src} alt={promo.image.alt} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent sm:bg-gradient-to-r sm:from-black/45 sm:via-black/10" />
        </div>
        <div className="relative -mt-16 px-4 pb-4 sm:absolute sm:top-1/2 sm:left-10 sm:mt-0 sm:max-w-md sm:-translate-y-1/2 sm:p-0 lg:left-16">
          <div className="rounded-2xl p-6 shadow-lift glass sm:p-8">
            <p className="eyebrow text-muted">{promo.eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl leading-[1.02] sm:text-5xl">{promo.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{promo.body}</p>
            <ButtonLink href={promo.cta.href} className="mt-6">
              {promo.cta.label} <Icon name="arrow-right" size={16} />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StoryPreview() {
  const { story } = homeContent;
  return (
    <section className="py-14 sm:py-24">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[5/4] lg:aspect-[4/5]">
          <SmartImage
            src={story.image.src}
            alt={story.image.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-lg">
          <p className="eyebrow text-muted">{story.eyebrow}</p>
          <h2 className="mt-4 font-display text-5xl leading-[1] sm:text-6xl">{story.title}</h2>
          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">{story.body}</p>
          <ButtonLink href={story.cta.href} variant="outline" className="mt-8">
            {story.cta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

const materialIcons: IconName[] = ["leaf", "needle", "ruler"];

export function MaterialsSection() {
  const { materials } = homeContent;
  return (
    <section className="bg-sand/60 py-16 sm:py-24">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHeading eyebrow={materials.eyebrow} title={materials.title} />
          <ul className="mt-10 grid gap-7">
            {materials.points.map((point, i) => (
              <li key={point.title} className="flex gap-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface text-ink shadow-soft">
                  <Icon name={materialIcons[i % materialIcons.length]} size={21} />
                </span>
                <div>
                  <h3 className="text-base font-medium">{point.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:col-span-6 lg:aspect-[5/6]">
          <SmartImage
            src={materials.image.src}
            alt={materials.image.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export function ServiceSection() {
  return (
    <section className="py-14 sm:py-20">
      <div className="container-page">
        <SectionHeading eyebrow="Here to help" title="Shopping, made easy" align="center" />
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {homeContent.service.map((item) => (
            <li key={item.title} className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
              <Icon name={item.icon as IconName} size={24} strokeWidth={1.4} />
              <h3 className="mt-5 text-[15px] font-medium">{item.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted sm:text-sm">{item.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-col items-start justify-between gap-5 rounded-2xl bg-ink p-6 text-paper sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="font-display text-3xl">Not sure about sizing?</p>
            <p className="mt-1 text-sm text-paper/70">Send us a message and we&rsquo;ll help you find the right fit.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ContactAction
              channel="whatsapp"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-paper px-6 text-sm font-medium text-ink transition-colors hover:bg-white"
            >
              <Icon name="whatsapp" size={18} /> Chat on WhatsApp
            </ContactAction>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full border border-paper/30 px-6 text-sm font-medium transition-colors hover:border-paper"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  const { newsletter } = homeContent;
  return (
    <section className="container-page pb-16 sm:pb-24">
      <div className="rounded-3xl border border-line bg-surface px-6 py-12 text-center sm:px-12 sm:py-16">
        <Icon name="mail" size={26} strokeWidth={1.3} className="mx-auto text-muted" />
        <h2 className="mt-4 font-display text-4xl sm:text-5xl">{newsletter.title}</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted">{newsletter.body}</p>
        <NewsletterForm className="mx-auto mt-8 max-w-md text-left" />
        <p className="mt-4 text-[12px] text-subtle">
          By subscribing you agree to receive emails from {business.brand.name}.
        </p>
      </div>
    </section>
  );
}
