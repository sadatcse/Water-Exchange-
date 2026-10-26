import { siteConfig } from '@/config/site';
import { seoSettings } from '@/lib/seo';

// Built per request (from the database / SEO settings), not once at build time
export const dynamic = 'force-dynamic';

// "Allow search engines" off in Settings → SEO blocks everything (e.g. while testing a staging copy)
export default async function robots() {
  const { allowIndexing } = await seoSettings();
  return {
    rules: allowIndexing ? { userAgent: '*', allow: '/', disallow: ['/dashboard/', '/api/'] } : { userAgent: '*', disallow: '/' },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
