import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { SmartImage } from "@/components/ui/smart-image";
import { business } from "@/config/business";
import { aboutContent } from "@/content/pages";

export const metadata: Metadata = {
  title: "About us",
  description: `The story behind ${business.brand.name}.`,
};

const pillarIcons: IconName[] = ["sparkle", "check", "needle", "leaf", "chat", "store"];

export default function AboutPage() {
  const { hero, story, pillars, closing } = aboutContent;
  return (
    <>
      <section className="container-page pt-10 sm:pt-14">
        <div className="max-w-3xl">
          <p className="eyebrow text-muted">{hero.eyebrow}</p>
          <h1 className="mt-4 font-display text-6xl leading-[0.95] sm:text-7xl lg:text-8xl">{hero.title}</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{hero.body}</p>
        </div>
        <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-3xl sm:mt-14 sm:aspect-[21/9]">
          <SmartImage src={hero.image.src} alt={hero.image.alt} fill priority sizes="100vw" className="object-cover" />
        </div>
      </section>

      <section className="container-page grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 className="font-display text-5xl leading-none sm:text-6xl">{story.title}</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            {story.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <SmartImage
            src={story.image.src}
            alt={story.image.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-sand/60 py-16 sm:py-24">
        <div className="container-page">
          <p className="eyebrow text-muted">What we stand for</p>
          <h2 className="mt-3 max-w-2xl font-display text-5xl leading-none sm:text-6xl">Six things we care about</h2>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {pillars.map((p, i) => (
              <li key={p.title} className="rounded-3xl bg-surface p-7 shadow-soft">
                <span className="flex size-12 items-center justify-center rounded-full bg-sand">
                  <Icon name={pillarIcons[i % pillarIcons.length]} size={21} />
                </span>
                <h3 className="mt-6 text-lg font-medium">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-16 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="relative aspect-[4/5] sm:aspect-[21/9]">
            <SmartImage src={closing.image.src} alt={closing.image.alt} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent sm:bg-gradient-to-r" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:inset-y-0 sm:right-auto sm:flex sm:max-w-lg sm:flex-col sm:justify-center sm:p-12">
            <h2 className="font-display text-4xl leading-none sm:text-5xl">{closing.title}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-white/85">{closing.body}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/shop" variant="light">
                Shop the collection
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="outline"
                className="border-white/50 text-white hover:border-white hover:bg-white/10"
              >
                Get in touch
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
