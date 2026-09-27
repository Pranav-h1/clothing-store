import type { ImageAsset } from "@/lib/types";

/**
 * DEMO IMAGERY — stock photography from Unsplash (free to use under the
 * Unsplash License). Replace with real product photography before launch.
 *
 * `focal` crops a detail view out of the same photo so each demo product has
 * a believable gallery: [x, y, zoom] where x/y are 0–1.
 */
export function photo(id: string, alt: string, focal?: [x: number, y: number, zoom: number]): ImageAsset {
  const base = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop`;
  const src = focal ? `${base}&crop=focalpoint&fp-x=${focal[0]}&fp-y=${focal[1]}&fp-z=${focal[2]}&ar=4:5` : base;
  return { src, alt };
}
