// Dashboard-editable site settings (Setting model), one document per key:
//   site  → timezone                                  (public)
//   seo   → titles, description, keywords, social links, search-engine verification (public)
//   email → SMTP account, admin email, notifications, reports (admins only; the password is encrypted)
// Reads merge the stored value over DEFAULTS, so a missing document still works.
import connectDB from '@/lib/db';
import Setting from '@/models/Setting';
import { HttpError } from '@/server/http';
import { str, bool, num, strList, imageUrl, toPlain } from '@/server/validate';
import { DEFAULT_TIME_ZONE, isValidTimeZone } from '@/lib/timezone';
import { siteConfig } from '@/config/site';
import { seal, open } from '@/lib/secret-box';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const DEFAULTS = {
  site: {
    timezone: DEFAULT_TIME_ZONE,
  },
  seo: {
    title: `${siteConfig.name} — ${siteConfig.slogan}`,
    // ≤ 160 characters so Google shows it in full
    description: 'ETP, STP & WTP design and installation, DOE water testing and environmental clearance in Bangladesh. Environment consultancy in Dhaka — start to finish.',
    keywords: [
      'ETP Bangladesh', 'STP design', 'WTP installation', 'effluent treatment plant', 'sewage treatment plant',
      'DOE environmental clearance', 'ECC renewal', 'water test Bangladesh', 'environment consultancy Dhaka',
    ],
    ogImage: '/og-image.jpg',
    allowIndexing: true,
    googleVerification: '',
    bingVerification: '',
    facebook: siteConfig.social.facebook,
    linkedin: siteConfig.social.linkedin,
    youtube: siteConfig.social.youtube,
    twitter: '',
  },
  email: {
    host: 'mail.waterexchangebd.com',
    port: 465,
    secure: true,
    user: 'info@waterexchangebd.com',
    passEnc: '',
    fromName: siteConfig.name,
    fromEmail: 'info@waterexchangebd.com',
    adminEmail: siteConfig.contact.email,
    notifyContact: true,
    weeklyReport: true,
    monthlyReport: true,
    reportRecipients: [],
  },
};

// Keys anyone may read (used to render public pages); the rest need an admin
export const PUBLIC_KEYS = ['site', 'seo'];
const KEYS = Object.keys(DEFAULTS);

const url = (value) => {
  const v = str(value, 300);
  if (!v) return '';
  try {
    return ['https:', 'http:'].includes(new URL(v).protocol) ? v : '';
  } catch {
    return '';
  }
};

const email = (value, label) => {
  const v = str(value, 160).toLowerCase();
  if (v && !EMAIL_RE.test(v)) throw new HttpError(400, `${label} is not a valid email address.`);
  return v;
};

// Each cleaner receives the request body and the currently stored value
const CLEANERS = {
  site: (input) => {
    const timezone = str(input.timezone, 60);
    if (!isValidTimeZone(timezone)) throw new HttpError(400, 'Choose a valid timezone.');
    return { timezone };
  },
  seo: (input) => {
    const value = {
      title: str(input.title, 120),
      description: str(input.description, 320),
      keywords: strList(input.keywords, { maxItems: 30, max: 60 }),
      ogImage: input.ogImage ? imageUrl(input.ogImage) : '',
      allowIndexing: bool(input.allowIndexing, true),
      // Only the code from the <meta content="…"> tag is kept
      googleVerification: str(input.googleVerification, 120).replace(/.*content=["']([^"']+)["'].*/, '$1'),
      bingVerification: str(input.bingVerification, 120).replace(/.*content=["']([^"']+)["'].*/, '$1'),
      facebook: url(input.facebook),
      linkedin: url(input.linkedin),
      youtube: url(input.youtube),
      twitter: str(input.twitter, 40).replace(/^@/, ''),
    };
    if (!value.title) throw new HttpError(400, 'Site title is required.');
    if (!value.description) throw new HttpError(400, 'Meta description is required.');
    if (input.ogImage && !value.ogImage) throw new HttpError(400, 'Share image must be a /… path or an http(s) URL.');
    return value;
  },
  email: (input, current) => {
    const port = Math.floor(num(input.port, 465));
    const value = {
      host: str(input.host, 160),
      port,
      secure: bool(input.secure, port === 465),
      user: str(input.user, 160),
      // A blank password keeps the saved one; clearPassword removes it
      passEnc: input.clearPassword ? '' : input.password ? seal(String(input.password).slice(0, 200)) : current.passEnc || '',
      fromName: str(input.fromName, 80) || siteConfig.name,
      fromEmail: email(input.fromEmail, 'From address'),
      adminEmail: email(input.adminEmail, 'Admin email'),
      notifyContact: bool(input.notifyContact, true),
      weeklyReport: bool(input.weeklyReport, true),
      monthlyReport: bool(input.monthlyReport, true),
      reportRecipients: strList(input.reportRecipients, { maxItems: 10, max: 160 }).map((r) => email(r, `Report recipient “${r}”`)),
    };
    if (!value.adminEmail) throw new HttpError(400, 'Admin email is required.');
    if (port < 1 || port > 65535) throw new HttpError(400, 'SMTP port must be between 1 and 65535.');
    return value;
  },
};

// What the browser may see: the encrypted password is replaced by a flag
const PRESENTERS = {
  email: ({ passEnc, ...rest }) => ({
    ...rest,
    hasPassword: Boolean(passEnc),
    // For the cPanel cron job shown in Settings → Reports (admins only — this key is never public)
    cronUrl: process.env.CRON_SECRET ? `${siteConfig.url}/api/cron/reports?key=${process.env.CRON_SECRET}` : '',
  }),
};

// Short in-memory cache for settings read by every page (app/layout.jsx)
const CACHE_MS = 60 * 1000;
const cache = new Map();

async function readRaw(key) {
  if (!KEYS.includes(key)) throw new HttpError(404, 'Unknown setting.');
  await connectDB();
  const doc = await Setting.findOne({ key }).lean();
  return toPlain({ ...DEFAULTS[key], ...(doc?.value || {}) });
}

export async function getCachedSetting(key) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  const value = await getSetting(key);
  cache.set(key, { value, expires: Date.now() + CACHE_MS });
  return value;
}

// Safe for the browser (secrets removed)
export async function getSetting(key) {
  const value = await readRaw(key);
  return PRESENTERS[key] ? PRESENTERS[key](value) : value;
}

export async function updateSetting(key, input = {}, { userId } = {}) {
  const current = await readRaw(key);
  const value = CLEANERS[key](input, current);
  await Setting.updateOne({ key }, { $set: { value, updatedBy: userId } }, { upsert: true });
  cache.delete(key);
  return getSetting(key);
}

// Server-only: the email settings with the decrypted SMTP password
export async function getEmailConfig() {
  const { passEnc, ...value } = await readRaw('email');
  return { ...value, pass: open(passEnc) };
}
