import { Plus_Jakarta_Sans, Hind_Siliguri } from 'next/font/google';
import '@/styles/globals.css';
import AppShell from '@/components/layout/AppShell';
import { siteConfig } from '@/config/site';
import { getCachedSetting } from '@/server/services/settings.service';
import { DEFAULT_TIME_ZONE, setTimeZone } from '@/lib/timezone';

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  // Home page: "Water Exchange — Water & Beyond"; other pages: "Page | Water Exchange"
  title: {
    default: `${siteConfig.name} — ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.slogan}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: 'en_US',
    type: 'website',
  },
};

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
  const timeZone = await readTimeZone();
  setTimeZone(timeZone);

  return (
    <html lang="en" className={`${sans.variable} ${bangla.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        <AppShell timeZone={timeZone}>{children}</AppShell>
      </body>
    </html>
  );
}
