import { Plus_Jakarta_Sans, Hind_Siliguri } from 'next/font/google';
import '@/styles/globals.css';
import AppShell from '@/components/layout/AppShell';
import { siteConfig } from '@/config/site';
import { getCachedSetting } from '@/server/services/settings.service';
import { DEFAULT_TIME_ZONE, setTimeZone } from '@/lib/timezone';
import { seoSettings, organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';

// Site-wide SEO from Dashboard → Settings → SEO. Pages add their own title, description and canonical URL
// (src/lib/seo.js → pageMetadata). Home page: the SEO title; other pages: "Page | Water Exchange".
export async function generateMetadata() {
  const seo = await seoSettings();
  const images = [seo.ogImage].filter(Boolean);
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: seo.title, template: `%s | ${siteConfig.shortName}` },
    description: seo.description,
    keywords: seo.keywords,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: { telephone: true, email: true, address: true },
    alternates: { canonical: '/' },
    openGraph: { title: seo.title, description: seo.description, url: '/', siteName: siteConfig.name, locale: 'en_US', type: 'website', images },
    twitter: { card: 'summary_large_image', title: seo.title, description: seo.description, images, ...(seo.twitter && { site: `@${seo.twitter}` }) },
    robots: seo.allowIndexing
      ? { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } }
      : { index: false, follow: false },
    verification: {
      ...(seo.googleVerification && { google: seo.googleVerification }),
      ...(seo.bingVerification && { other: { 'msvalidate.01': seo.bingVerification } }),
    },
    category: 'Environmental consultancy',
  };
}

const sans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
// Bangla copy (service line from the business card)
const bangla = Hind_Siliguri({ subsets: ['bengali', 'latin'], weight: ['400', '600', '700'], variable: '--font-bangla', display: 'swap' });

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#030c14' },
  ],
};

// Every page reads the site timezone per request, so a change in Settings applies immediately
export const dynamic = 'force-dynamic';

// Applies the saved theme (or the system preference) before first paint — no light/dark flash
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

async function readTimeZone() {
  try {
    return (await getCachedSetting('site')).timezone; // cached 60 s — keeps first paint fast
  } catch {
    return DEFAULT_TIME_ZONE; // database unreachable — pages still render
  }
}

export default async function RootLayout({ children }) {
  const [timeZone, seo] = await Promise.all([readTimeZone(), seoSettings()]);
  setTimeZone(timeZone);
  const social = { facebook: seo.facebook, linkedin: seo.linkedin, youtube: seo.youtube };

  return (
    <html lang="en" className={`${sans.variable} ${bangla.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <JsonLd data={[organizationJsonLd(seo), websiteJsonLd()]} />
        <AppShell timeZone={timeZone} social={social}>{children}</AppShell>
      </body>
    </html>
  );
}
