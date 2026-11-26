import manifest from "../content/image-manifest.json";
import { asset } from "./runtime";

type Entry = { w: number; h: number; widths: number[] };
const images = manifest as Record<string, Entry>;

export interface ResolvedImage {
  /** Default src for <img>. */
  src: string;
  srcSet?: string;
  /** Highest-resolution file, used by the drawing viewer. */
  full: string;
  width: number;
  height: number;
}

/**
 * Turns a figure's `image` value into real URLs.
 * Manifest keys ("project/name") get responsive WebP sizes; anything else is
 * treated as a direct path inside /public.
 */
export function resolveImage(ref: string | undefined, fallback?: { width?: number; height?: number }): ResolvedImage | null {
  if (!ref) return null;
  const e = images[ref];
  if (e) {
    const variant = (w: number) => asset(`images/${ref}-${w}.webp`);
    const full = asset(`images/${ref}-full.webp`);
    const set = e.widths.map((w) => `${variant(w)} ${w}w`);
    set.push(`${full} ${e.w}w`);
    const largestVariant = e.widths[e.widths.length - 1];
    return {
      src: largestVariant ? variant(largestVariant) : full,
      srcSet: set.join(", "),
      full,
      width: e.w,
      height: e.h,
    };
  }
  const url = asset(ref);
  return { src: url, full: url, width: fallback?.width ?? 1600, height: fallback?.height ?? 1000 };
}
