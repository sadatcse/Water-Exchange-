import { siteConfig } from '@/config/site';
import { exploreNav, legalNav } from '@/config/navigation';
import { listProducts } from '@/server/services/product.service';
import { allPublishedSlugs } from '@/server/services/blog.service';

// Built per request (from the database / SEO settings), not once at build time
export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const pages = [...exploreNav, ...legalNav].map((route) => ({
    url: `${siteConfig.url}${route.href === '/' ? '' : route.href}`,
    lastModified: new Date(),
    changeFrequency: route.href.startsWith('/legal') ? 'yearly' : 'weekly',
    priority: route.href === '/' ? 1 : route.href.startsWith('/legal') ? 0.3 : 0.7,
  }));
  const [products, posts] = await Promise.all([listProducts(), allPublishedSlugs()]);
  const productPages = products.map((p) => ({
    url: `${siteConfig.url}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  const postPages = posts.map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  return [...pages, ...productPages, ...postPages];
}
