// next/image props for a stored image URL. Local files and Unsplash photos go through the image loader
// (src/lib/image-loader.js — Unsplash resizes on its CDN); any other URL pasted in the dashboard is used as-is.
export const OPTIMIZED_HOSTS = ['images.unsplash.com'];

export function imageProps(src) {
  if (!src || src.startsWith('/')) return {};
  try {
    return OPTIMIZED_HOSTS.includes(new URL(src).hostname) ? {} : { unoptimized: true };
  } catch {
    return { unoptimized: true };
  }
}
