// HTML email templates (table layout + inline styles so they render in Gmail, Outlook and phones).
// Every value that came from a visitor or the database goes through esc().
import { siteConfig } from '@/config/site';

export const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const BRAND = '#0369a1';
const MUTED = '#64748b';
const n = (value) => Number(value || 0).toLocaleString('en-US');

export function layout({ title, preheader = '', body }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#eef4f8;font-family:Segoe UI,Helvetica,Arial,sans-serif;color:#0f172a">
<span style="display:none;max-height:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef4f8;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:linear-gradient(135deg,#03263f,#0369a1 60%,#06b6d4);background-color:#03263f;padding:26px 28px;color:#ffffff">
<div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.8">${esc(siteConfig.name)}</div>
<div style="font-size:22px;font-weight:700;margin-top:6px">${esc(title)}</div>
</td></tr>
<tr><td style="padding:24px 28px">${body}</td></tr>
<tr><td style="padding:16px 28px 24px;font-size:12px;color:${MUTED};border-top:1px solid #e2e8f0">
${esc(siteConfig.name)} · ${esc(siteConfig.contact.address)}<br>
<a href="${siteConfig.url}/dashboard" style="color:${BRAND}">Open the dashboard</a>
</td></tr>
</table></td></tr></table></body></html>`;
}

const heading = (text) => `<h3 style="margin:26px 0 10px;font-size:15px;color:#0f172a">${esc(text)}</h3>`;

// [[label, value], …] → two-column table
export const rowsTable = (rows, empty = 'Nothing in this period.') =>
  rows.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse">${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:7px 0;border-bottom:1px solid #f1f5f9;color:#334155">${esc(label)}</td><td align="right" style="padding:7px 0;border-bottom:1px solid #f1f5f9;font-weight:600">${esc(value)}</td></tr>`
        )
        .join('')}</table>`
    : `<p style="margin:0;font-size:14px;color:${MUTED}">${esc(empty)}</p>`;

// Change against the previous period: "▲ 12%" / "▼ 5%" / "new"
function change(current, previous) {
  if (!previous) return current ? '<span style="color:#16a34a">new</span>' : '<span style="color:#94a3b8">—</span>';
  const pct = Math.round(((current - previous) / previous) * 100);
  if (pct === 0) return '<span style="color:#94a3b8">no change</span>';
  return pct > 0 ? `<span style="color:#16a34a">▲ ${pct}%</span>` : `<span style="color:#dc2626">▼ ${Math.abs(pct)}%</span>`;
}

const kpi = (label, value, previous) => `<td width="50%" style="padding:6px">
<div style="border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px">
<div style="font-size:12px;color:${MUTED}">${esc(label)}</div>
<div style="font-size:26px;font-weight:700;margin-top:2px">${n(value)}</div>
${previous === undefined ? '' : `<div style="font-size:12px;margin-top:2px">${change(value, previous)} <span style="color:#94a3b8">vs previous</span></div>`}
</div></td>`;

// ---------- new contact request ----------

export function contactNotification(message) {
  const quote = message.subject?.startsWith('Quotation:');
  const body = `
<p style="margin:0 0 16px;font-size:15px">${quote ? 'A visitor asked for a product quotation.' : 'A visitor sent a message from the Contact page.'}</p>
${rowsTable(
  [
    ['Name', message.fullName],
    ['Email', message.email],
    ['Phone', message.phone || '—'],
    ['Subject', message.subject || '—'],
  ],
  ''
)}
<div style="margin-top:16px;padding:14px 16px;background:#f8fafc;border-radius:10px;font-size:14px;line-height:1.6;white-space:pre-line">${esc(message.message)}</div>
<p style="margin:20px 0 0"><a href="mailto:${esc(message.email)}?subject=${encodeURIComponent(`Re: ${message.subject || 'Your enquiry'}`)}" style="display:inline-block;background:${BRAND};color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;font-size:14px">Reply to ${esc(message.fullName)}</a>
&nbsp; <a href="${siteConfig.url}/dashboard/messages" style="color:${BRAND};font-size:14px">View in dashboard</a></p>`;
  return {
    subject: `${quote ? 'Quotation request' : 'New contact request'}: ${message.subject || message.fullName}`,
    html: layout({ title: quote ? 'New quotation request' : 'New contact request', preheader: `${message.fullName}: ${message.message.slice(0, 80)}`, body }),
    text: `New contact request\n\nName: ${message.fullName}\nEmail: ${message.email}\nPhone: ${message.phone || '-'}\nSubject: ${message.subject || '-'}\n\n${message.message}\n\n${siteConfig.url}/dashboard/messages`,
  };
}

// ---------- weekly / monthly report ----------

export function reportEmail(r) {
  const label = r.period === 'weekly' ? 'Weekly' : 'Monthly';
  const v = r.visitors;
  const body = `
<p style="margin:0 0 14px;font-size:15px;color:#334155">${esc(r.rangeLabel)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
${kpi('Website visitors', v.total, v.previousTotal)}${kpi('Unique visitors', v.unique, v.previousUnique)}
</tr><tr>
${kpi('From search engines', v.sources.search, v.previousSearch)}${kpi('Contact requests', r.contacts.total, r.contacts.previousTotal)}
</tr></table>

${heading('Visitors by day')}
${rowsTable(v.byDay.map((d) => [d.label, n(d.count)]))}

${heading('Where visitors came from')}
${rowsTable([
  ['Direct (typed the address / bookmark)', n(v.sources.direct)],
  ['Search engines', n(v.sources.search)],
  ['Other websites & social media', n(v.sources.referral)],
])}

${heading('Search engines')}
${rowsTable(v.searchEngines.map((s) => [s.name, n(s.count)]), 'No visitors from search engines in this period.')}

${heading('Top referring websites')}
${rowsTable(v.referrers.map((s) => [s.name, n(s.count)]), 'No visitors from other websites in this period.')}

${heading('Most visited landing pages')}
${rowsTable(v.pages.map((p) => [p.name, n(p.count)]))}

${heading('Countries')}
${rowsTable(v.countries.map((c) => [c.name, n(c.count)]))}

${heading('Devices')}
${rowsTable(v.devices.map((d) => [d.name, n(d.count)]))}

${heading(`Contact requests (${n(r.contacts.total)})`)}
${rowsTable([
  ['General enquiries', n(r.contacts.total - r.contacts.quotations)],
  ['Product quotation requests', n(r.contacts.quotations)],
  ['Unread in the inbox right now', n(r.contacts.unreadNow)],
])}
${
  r.contacts.latest.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;font-size:13px;border-collapse:collapse">${r.contacts.latest
        .map(
          (m) =>
            `<tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9"><b>${esc(m.fullName)}</b> · <a href="mailto:${esc(m.email)}" style="color:${BRAND}">${esc(m.email)}</a><br><span style="color:${MUTED}">${esc(m.subject || m.message.slice(0, 90))}</span></td><td align="right" style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:${MUTED};white-space:nowrap">${esc(m.date)}</td></tr>`
        )
        .join('')}</table>`
    : ''
}

${heading('Dashboard sign-ins')}
${rowsTable([
  ['Successful sign-ins', n(r.logins.success)],
  ['Failed sign-in attempts', n(r.logins.failed)],
])}

${heading('Website content')}
${rowsTable([
  ['Blog posts published in this period', n(r.content.newPosts)],
  ['Published blog posts in total', n(r.content.posts)],
  ['Published products', n(r.content.products)],
])}
<p style="margin:22px 0 0;font-size:12px;color:${MUTED}">Search keywords are not shared by Google or Bing with websites. To see what people searched for, connect the site to Google Search Console (Dashboard → Settings → SEO → Google verification).</p>`;

  return {
    subject: `${label} report: ${n(v.total)} visitors, ${n(r.contacts.total)} contact requests — ${r.rangeShort}`,
    html: layout({ title: `${label} website report`, preheader: `${n(v.total)} visitors · ${n(r.contacts.total)} contact requests · ${r.rangeLabel}`, body }),
    text: `${label} website report — ${r.rangeLabel}\n\nVisitors: ${v.total} (unique ${v.unique})\nFrom search engines: ${v.sources.search}\nContact requests: ${r.contacts.total}\n\n${siteConfig.url}/dashboard`,
  };
}

export function testEmail(to) {
  return {
    subject: `Test email from ${siteConfig.name}`,
    html: layout({
      title: 'Email is working',
      body: `<p style="margin:0;font-size:15px;line-height:1.6">This test was sent from your website’s dashboard to <b>${esc(to)}</b>. Contact requests and the weekly / monthly reports will be delivered the same way.</p>`,
    }),
    text: `This test was sent from your website dashboard to ${to}.`,
  };
}
