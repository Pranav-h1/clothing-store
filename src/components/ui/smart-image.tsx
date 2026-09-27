"use client";

import Image, { type ImageLoaderProps, type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/format";

/** Unsplash (imgix) resizes on its CDN, so we skip the Next optimizer for it. */
function unsplashLoader({ src, width, quality }: ImageLoaderProps) {
  return `${src}&w=${width}&q=${quality ?? 72}`;
}

/**
 * next/image wrapper: CDN-aware loader, a warm placeholder tone while
 * loading, and a graceful fallback if an image fails.
 */
export function SmartImage({ src, alt, className, priority, ...rest }: ImageProps & { src: string }) {
  const [failed, setFailed] = useState(false);
  const isUnsplash = src.startsWith("https://images.unsplash.com/");
  // Other remote hosts (e.g. URLs typed into the demo admin) aren't in the
  // optimizer allow-list, so serve them as-is. Local /public images are optimized.
  const isOtherRemote = !isUnsplash && /^https?:\/\//.test(src);

  if (failed) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn("absolute inset-0 flex items-center justify-center bg-sand text-xs text-muted", className)}
      >
        Image unavailable
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      loader={isUnsplash ? unsplashLoader : undefined}
      unoptimized={isOtherRemote}
      // Next 16 deprecates `priority`; eager + high fetch priority is the recommended equivalent.
      {...(priority ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
      onError={() => setFailed(true)}
      className={cn("bg-sand", className)}
      {...rest}
    />
  );
}
