// Email test, report sending / preview and the cron endpoint
import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { ok, readJson, HttpError } from '@/server/http';
import { str } from '@/server/validate';
import { getEmailConfig } from '@/server/services/settings.service';
import { sendMail, verifySmtp, smtpErrorMessage } from '@/server/services/mail.service';
import { buildReport, sendReport, sendDueReports, reportState, PERIODS } from '@/server/services/report.service';
import { reportEmail, testEmail } from '@/server/emails/templates';

const periodOf = (value) => {
  const period = str(value, 20);
  if (!PERIODS.includes(period)) throw new HttpError(400, 'Choose weekly or monthly.');
  return period;
};

// POST /api/email/test { to? } → checks the SMTP login and sends a test email (admin)
export async function sendTest({ req }) {
  const { to } = await readJson(req).catch(() => ({}));
  const cfg = await getEmailConfig();
  const recipient = str(to, 160) || cfg.adminEmail;
  try {
    await verifySmtp();
    await sendMail({ to: recipient, ...testEmail(recipient) });
  } catch (error) {
    throw new HttpError(400, smtpErrorMessage(error));
  }
  return ok({ title: recipient }, `Test email sent to ${recipient}.`);
}

// POST /api/reports/send { period } → emails the report for the last completed period now (admin)
export async function sendNow({ req }) {
  const period = periodOf((await readJson(req)).period);
  try {
    const sent = await sendReport(period);
    return ok({ ...sent, title: `${period} report` }, `The ${period} report (${sent.range}) was sent to ${sent.to.join(', ')}.`);
  } catch (error) {
    throw new HttpError(400, smtpErrorMessage(error));
  }
}

// GET /api/reports/preview?period= → the report email as HTML, for the preview in Settings (admin)
export async function preview({ query }) {
  const report = await buildReport(periodOf(query.get('period')));
  return new NextResponse(reportEmail(report).html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

// GET /api/reports/state → which periods were last sent (admin)
export const state = async () => ok(await reportState());

// GET /api/cron/reports?key=CRON_SECRET → run daily by a cPanel cron job
export async function cron({ query }) {
  const secret = process.env.CRON_SECRET || '';
  const given = str(query.get('key'), 200);
  const valid = secret.length >= 16 && given.length === secret.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!valid) throw new HttpError(401, 'Invalid cron key.');
  return ok(await sendDueReports());
}
