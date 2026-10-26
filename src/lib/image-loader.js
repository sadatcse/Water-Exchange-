'use client';
// next/image loader (next.config.mjs → images.loaderFile). No server-side optimizer is used, so the site
// needs no `sharp` binary and no CPU for resizing on shared hosting (cPanel):
//   - Unsplash photos are resized by Unsplash's CDN (w / q parameters)
//   - local files in /public are already optimized WebP and are served as they are
//   - any other URL is used unchanged
export default function imageLoader({ src, width, quality }) {
  if (src.startsWith('https://images.unsplash.com/')) {
    const url = new URL(src);
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(quality || 75));
    url.searchParams.set('auto', 'format');
    return url.href;
  }
  // The width hint keeps next/image's srcset valid; static file serving ignores it
  return src.startsWith('/') ? `${src}?w=${width}` : src;
}
