// Page metadata + structured data (JSON-LD) built from Dashboard → Settings → SEO. Server-only.
import { siteConfig } from '@/config/site';
import { DEFAULTS, getCachedSetting } from '@/server/services/settings.service';

// SEO settings, or the defaults when the database can't be reached (pages still render)
export async function seoSettings() {
  try {
    return await getCachedSetting('seo');
  } catch {
    return DEFAULTS.seo;
  }
}

export const absoluteUrl = (path = '/') => (/^https?:\/\//.test(path) ? path : `${siteConfig.url}${path === '/' ? '' : path}`);

/**
 * Metadata for one page: its own title/description, a canonical URL and complete Open Graph / Twitter
 * tags (child pages replace the parent's openGraph object, so it is rebuilt here).
 *   export const generateMetadata = () => pageMetadata({ title: 'About', description: '…', path: '/about' });
 */
export async function pageMetadata({ title, description, path, image, type = 'website', extra = {}, noIndex = false }) {
  const seo = await seoSettings();
  const shareTitle = title ? `${title} | ${siteConfig.shortName}` : seo.title;
  const desc = description || seo.description;
  const images = [image || seo.ogImage].filter(Boolean);
  return {
    ...(title && { title }),
    description: desc,
    alternates: { canonical: path },
    openGraph: { title: shareTitle, description: desc, url: path, siteName: siteConfig.name, locale: 'en_US', type, images, ...extra },
    twitter: { card: 'summary_large_image', title: shareTitle, description: desc, images, ...(seo.twitter && { site: `@${seo.twitter}` }) },
    ...(noIndex && { robots: { index: false, follow: true } }),
  };
}

// ---------- JSON-LD ----------

export function organizationJsonLd(seo) {
  const { contact } = siteConfig;
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    slogan: siteConfig.tagline,
    description: seo.description,
    url: siteConfig.url,
    logo: absoluteUrl('/icons/icon-512.png'),
    image: absoluteUrl(seo.ogImage || '/og-image.jpg'),
    email: contact.email,
    telephone: contact.phones[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'House# 396 (4th Floor), Road# 29, New DOHS Mohakhali',
      addressLocality: 'Dhaka',
      postalCode: '1212',
      addressCountry: 'BD',
    },
    areaServed: { '@type': 'Country', name: 'Bangladesh' },
    founder: { '@type': 'Person', name: siteConfig.founder.name, jobTitle: siteConfig.founder.title },
    knowsAbout: ['Effluent Treatment Plant (ETP)', 'Sewage Treatment Plant (STP)', 'Water Treatment Plant (WTP)', 'DOE environmental clearance', 'Water quality testing', 'Environmental Impact Assessment'],
    sameAs: [seo.facebook, seo.linkedin, seo.youtube, seo.twitter && `https://x.com/${seo.twitter}`].filter(Boolean),
  };
}

export const websiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteConfig.url}/#website`,
  name: siteConfig.name,
  url: siteConfig.url,
  publisher: { '@id': `${siteConfig.url}/#organization` },
  inLanguage: 'en',
});

// crumbs: [{ name, path }] — Home is added first
export const breadcrumbJsonLd = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absoluteUrl(c.path) })),
});

export const productJsonLd = (product, categoryLabel) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.summary,
  image: [absoluteUrl(product.image)],
  url: absoluteUrl(`/products/${product.slug}`),
  category: categoryLabel,
  ...(product.brand && { brand: { '@type': 'Brand', name: product.brand.split(/,\s*(?!Ltd)/)[0] } }),
  ...(product.origin && { countryOfOrigin: product.origin }),
  additionalProperty: product.specs.map((s) => ({ '@type': 'PropertyValue', name: s.label, value: s.value })),
  // Sold by quotation — no public price
  seller: { '@id': `${siteConfig.url}/#organization` },
});

export const articleJsonLd = (post) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  description: post.excerpt,
  image: [absoluteUrl(post.coverImage)],
  datePublished: post.publishedAt,
  dateModified: post.updatedAt || post.publishedAt,
  author: { '@type': 'Organization', name: post.author || siteConfig.name },
  publisher: { '@id': `${siteConfig.url}/#organization` },
  mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  articleSection: post.category,
  keywords: post.tags?.join(', '),
});

export const faqJsonLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q ?? f.question, acceptedAnswer: { '@type': 'Answer', text: f.a ?? f.answer } })),
});
