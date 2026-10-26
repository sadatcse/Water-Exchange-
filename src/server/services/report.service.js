// Weekly / monthly website reports emailed to the admin (Dashboard → Settings → Reports).
// A daily cron job calls /api/cron/reports; each report is sent once per completed period.
import connectDB from '@/lib/db';
import Setting from '@/models/Setting';
import VisitorLog from '@/models/VisitorLog';
import ContactMessage from '@/models/ContactMessage';
import LoginLog from '@/models/LoginLog';
import BlogPost from '@/models/BlogPost';
import Product from '@/models/Product';
import { HttpError } from '@/server/http';
import { getCachedSetting, getEmailConfig } from '@/server/services/settings.service';
import { sendMail, recipientsFor } from '@/server/services/mail.service';
import { reportEmail } from '@/server/emails/templates';
import { parseUserAgent } from '@/lib/user-agent';

export const PERIODS = ['weekly', 'monthly'];
const STATE_KEY = 'reports-state';

// ---------- periods in the site timezone ----------

// Calendar parts of `date` as seen in `timeZone`
function partsIn(date, timeZone) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' })
      .formatToParts(date)
      .map(({ type, value }) => [type, Number(value)])
  );
  return { y: p.year, m: p.month - 1, d: p.day, h: p.hour, min: p.minute, s: p.second };
}

// The instant of 00:00 on y-m-d in `timeZone`
function midnight(y, m, d, timeZone) {
  const guess = Date.UTC(y, m, d);
  const p = partsIn(new Date(guess), timeZone);
  const offset = Date.UTC(p.y, p.m, p.d, p.h, p.min, p.s) - guess;
  return new Date(guess - offset);
}

// Last completed week (Mon–Sun) or month, plus the period before it for comparison
export function lastCompletePeriod(period, timeZone, now = new Date()) {
  const t = partsIn(now, timeZone);
  let start;
  let end;
  let prevStart;
  if (period === 'weekly') {
    const weekday = (new Date(Date.UTC(t.y, t.m, t.d)).getUTCDay() + 6) % 7; // Monday = 0
    end = midnight(t.y, t.m, t.d - weekday, timeZone);
    start = midnight(t.y, t.m, t.d - weekday - 7, timeZone);
    prevStart = midnight(t.y, t.m, t.d - weekday - 14, timeZone);
  } else {
    end = midnight(t.y, t.m, 1, timeZone);
    start = midnight(t.y, t.m - 1, 1, timeZone);
    prevStart = midnight(t.y, t.m - 2, 1, timeZone);
  }
  // Stable id of the period, e.g. "2026-10-19" (week starting) or "2026-09" (month)
  const sp = partsIn(start, timeZone);
  const key = period === 'weekly' ? `${sp.y}-${String(sp.m + 1).padStart(2, '0')}-${String(sp.d).padStart(2, '0')}` : `${sp.y}-${String(sp.m + 1).padStart(2, '0')}`;
  return { start, end, prevStart, key };
}

// ---------- data ----------

const top = (rows, limit = 8) => rows.sort((a, b) => b.count - a.count).slice(0, limit);
const countBy = (items, keyFn) => {
  const map = new Map();
  for (const item of items) {
    const k = keyFn(item) || 'Unknown';
    map.set(k, (map.get(k) || 0) + 1);
  }
  return [...map].map(([name, count]) => ({ name, count }));
};

export async function buildReport(period, { now = new Date() } = {}) {
  if (!PERIODS.includes(period)) throw new HttpError(400, 'Unknown report period.');
  await connectDB();
  const { timezone } = await getCachedSetting('site');
  const { start, end, prevStart, key } = lastCompletePeriod(period, timezone, now);
  const range = { $gte: start, $lt: end };
  const prevRange = { $gte: prevStart, $lt: start };

  const [visits, prevVisits, contacts, prevContacts, unreadNow, loginsOk, loginsFailed, newPosts, posts, products] = await Promise.all([
    VisitorLog.find({ createdAt: range }).select('ip source sourceName referrer path country device userAgent createdAt').lean(),
    VisitorLog.find({ createdAt: prevRange }).select('ip source').lean(),
    ContactMessage.find({ createdAt: range }).sort({ createdAt: -1 }).select('fullName email subject message createdAt').lean(),
    ContactMessage.countDocuments({ createdAt: prevRange }),
    ContactMessage.countDocuments({ status: 'unread' }),
    LoginLog.countDocuments({ createdAt: range, success: true }),
    LoginLog.countDocuments({ createdAt: range, success: false }),
    BlogPost.countDocuments({ published: true, publishedAt: range }),
    BlogPost.countDocuments({ published: true, publishedAt: { $lte: now } }),
    Product.countDocuments({ published: true }),
  ]);

  const dayFmt = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, weekday: 'short', day: 'numeric', month: 'short' });
  const rangeFmt = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, day: 'numeric', month: 'long', year: 'numeric' });
  const shortFmt = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, day: 'numeric', month: 'short' });
  const lastDay = new Date(end.getTime() - 1);

  // Every day of the period, including days without visits
  const byDay = [];
  for (let d = new Date(start); d < end; d = new Date(d.getTime() + 86400000)) {
    const label = dayFmt.format(d);
    byDay.push({ label, count: 0 });
  }
  for (const v of visits) {
    const row = byDay.find((b) => b.label === dayFmt.format(v.createdAt));
    if (row) row.count += 1;
  }

  const search = visits.filter((v) => v.source === 'Search Engine');
  const referral = visits.filter((v) => v.source === 'Referral');

  return {
    period,
    key,
    start,
    end,
    rangeLabel: `${rangeFmt.format(start)} – ${rangeFmt.format(lastDay)}`,
    rangeShort: period === 'weekly' ? `${shortFmt.format(start)} – ${shortFmt.format(lastDay)}` : new Intl.DateTimeFormat('en-GB', { timeZone: timezone, month: 'long', year: 'numeric' }).format(start),
    visitors: {
      total: visits.length,
      previousTotal: prevVisits.length,
      unique: new Set(visits.map((v) => v.ip)).size,
      previousUnique: new Set(prevVisits.map((v) => v.ip)).size,
      previousSearch: prevVisits.filter((v) => v.source === 'Search Engine').length,
      byDay: period === 'monthly' ? byDay.filter((d) => d.count) : byDay,
      sources: { direct: visits.filter((v) => v.source === 'Direct').length, search: search.length, referral: referral.length },
      searchEngines: top(countBy(search, (v) => v.sourceName)),
      referrers: top(countBy(referral, (v) => v.sourceName)),
      pages: top(countBy(visits, (v) => v.path)),
      countries: top(countBy(visits, (v) => v.country)),
      // Older visits were stored without a device — work it out from the browser string
      devices: top(countBy(visits, (v) => v.device || parseUserAgent(v.userAgent).device)),
    },
    contacts: {
      total: contacts.length,
      previousTotal: prevContacts,
      quotations: contacts.filter((m) => m.subject?.startsWith('Quotation:')).length,
      unreadNow,
      latest: contacts.slice(0, 10).map((m) => ({ ...m, date: shortFmt.format(m.createdAt) })),
    },
    logins: { success: loginsOk, failed: loginsFailed },
    content: { newPosts, posts, products },
  };
}

// Builds and emails one report. Returns { period, key, to }.
export async function sendReport(period) {
  const report = await buildReport(period);
  const cfg = await getEmailConfig();
  const to = recipientsFor(cfg);
  await sendMail({ to, ...reportEmail(report) });
  return { period, key: report.key, range: report.rangeLabel, to };
}

// Cron: sends each enabled report once for its last completed period.
// The period is claimed in the database first, so overlapping cron runs cannot send it twice.
export async function sendDueReports() {
  await connectDB();
  const cfg = await getEmailConfig();
  const { timezone } = await getCachedSetting('site');
  const results = [];
  for (const period of PERIODS) {
    if ((period === 'weekly' && !cfg.weeklyReport) || (period === 'monthly' && !cfg.monthlyReport)) {
      results.push({ period, status: 'disabled' });
      continue;
    }
    const { key } = lastCompletePeriod(period, timezone);
    const field = `value.${period}`;
    const before = await Setting.findOneAndUpdate({ key: STATE_KEY, [field]: { $ne: key } }, { $set: { [field]: key } }, { upsert: true }).lean().catch((e) => {
      if (e?.code === 11000) return 'taken'; // another run claimed it at the same moment
      throw e;
    });
    if (before === 'taken' || (before && before.value?.[period] === key)) {
      results.push({ period, status: 'already sent', key });
      continue;
    }
    try {
      const sent = await sendReport(period);
      results.push({ ...sent, status: 'sent' });
    } catch (error) {
      // Release the claim so the next cron run tries again
      await Setting.updateOne({ key: STATE_KEY }, before?.value?.[period] ? { $set: { [field]: before.value[period] } } : { $unset: { [field]: '' } });
      results.push({ period, status: 'failed', key, error: error.message });
    }
  }
  return results;
}

export async function reportState() {
  await connectDB();
  return (await Setting.findOne({ key: STATE_KEY }).lean())?.value || {};
}
