"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/format";
import type { ImageAsset } from "@/lib/types";
import { Icon } from "../ui/icon";
import { SmartImage } from "../ui/smart-image";

export function ProductGallery({ images, name }: { images: ImageAsset[]; name: string }) {
  const [active, setActive] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const count = images.length;

  const go = (index: number) => {
    const next = (index + count) % count;
    setActive(next);
    const el = scroller.current;
    if (el) el.scrollTo({ left: el.clientWidth * next, behavior: "smooth" });
  };

  return (
    <div
      className="flex flex-col-reverse gap-3 lg:flex-row lg:gap-4"
      aria-roledescription="carousel"
      aria-label={`${name} images`}
    >
      {/* Thumbnails */}
      {count > 1 && (
        <div className="hidden gap-3 lg:flex lg:w-20 lg:flex-col">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show image ${i + 1} of ${count}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-[4/5] w-full overflow-hidden rounded-xl ring-offset-2 ring-offset-paper transition-[opacity,box-shadow]",
                i === active ? "ring-2 ring-ink" : "opacity-60 hover:opacity-100",
              )}
            >
              <SmartImage src={img.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main image — swipeable on touch, arrows on desktop */}
      <div className="group relative min-w-0 flex-1">
        <div
          ref={scroller}
          tabIndex={0}
          aria-label="Product images, scroll horizontally"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== active) setActive(i);
          }}
          className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto rounded-2xl sm:rounded-3xl"
        >
          {images.map((img, i) => (
            <div
              key={img.src}
              className="relative aspect-[4/5] w-full shrink-0 snap-center bg-sand"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
            >
              <SmartImage
                src={img.src}
                alt={img.alt}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <div className="pointer-events-none absolute inset-x-4 top-1/2 hidden -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 lg:flex">
              <button
                type="button"
                onClick={() => go(active - 1)}
                className="pointer-events-auto flex size-11 items-center justify-center rounded-full shadow-soft glass"
                aria-label="Previous image"
              >
                <Icon name="chevron-left" size={20} />
              </button>
              <button
                type="button"
                onClick={() => go(active + 1)}
                className="pointer-events-auto flex size-11 items-center justify-center rounded-full shadow-soft glass"
                aria-label="Next image"
              >
                <Icon name="chevron-right" size={20} />
              </button>
            </div>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3 py-2 glass lg:hidden">
              {images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show image ${i + 1} of ${count}`}
                  className={cn(
                    "h-1.5 rounded-full transition-[width,background-color]",
                    i === active ? "w-5 bg-ink" : "w-1.5 bg-ink/30",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
