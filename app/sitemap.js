import { siteConfig } from '@/config/site';
import { exploreNav, legalNav } from '@/config/navigation';

export default function sitemap() {
  return [...exploreNav, ...legalNav].map((route) => ({
    url: `${siteConfig.url}${route.href === '/' ? '' : route.href}`,
    lastModified: new Date(),
    changeFrequency: route.href.startsWith('/legal') ? 'yearly' : 'weekly',
    priority: route.href === '/' ? 1 : route.href.startsWith('/legal') ? 0.3 : 0.7,
  }));
}
