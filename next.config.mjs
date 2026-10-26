import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained build in .next/standalone (only the files needed at runtime, no npm install on the
  // server) — what scripts/build-cpanel.mjs packages for cPanel. See DEPLOY-CPANEL.md.
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  // Pin the project root so Next doesn't pick up a lockfile from a parent folder
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
  // The custom image loader never uses sharp — keep its platform-specific binaries out of the package
  outputFileTracingExcludes: { '*': ['node_modules/sharp/**', 'node_modules/@img/**'] },
  // No server-side image optimizer (no sharp binary / CPU needed on shared hosting) — see src/lib/image-loader.js
  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.js',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Images, logos and icons change rarely — let browsers cache them for 30 days
      {
        source: '/:dir(images|brand|icons)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
      {
        source: '/og-image.jpg',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
    ];
  },
};

export default nextConfig;
