// Outgoing email (SMTP account from Dashboard → Settings → Email). Server-only.
import nodemailer from 'nodemailer';
import { HttpError } from '@/server/http';
import { getEmailConfig } from '@/server/services/settings.service';
import { siteConfig } from '@/config/site';

const CONNECTION_ERRORS = new Set(['ETIMEDOUT', 'ESOCKET', 'ECONNECTION', 'ECONNREFUSED', 'ECONNRESET', 'EHOSTUNREACH']);

const createTransport = (cfg, { port, secure }) =>
  nodemailer.createTransport({
    host: cfg.host,
    port,
    secure, // true for 465 (SSL); false for 587 (STARTTLS, required below)
    requireTLS: !secure,
    auth: { user: cfg.user, pass: cfg.pass },
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 20000,
  });

async function config() {
  const cfg = await getEmailConfig();
  if (!cfg.host || !cfg.user || !cfg.pass) throw new HttpError(400, 'Email is not set up yet — add the SMTP server, username and password in Settings.');
  return cfg;
}

// Runs fn(transporter) on the saved port. Many networks block port 465, so when an SSL connection on
// 465 can't be made at all, it is retried once on 587 with STARTTLS (same server and login).
async function withTransport(fn) {
  const cfg = await config();
  try {
    return await fn(createTransport(cfg, { port: cfg.port, secure: cfg.secure }), cfg);
  } catch (error) {
    if (cfg.port !== 465 || !CONNECTION_ERRORS.has(error?.code)) throw error;
    console.warn(`SMTP port 465 unreachable (${error.code}) — retrying on 587 with STARTTLS`);
    return fn(createTransport(cfg, { port: 587, secure: false }), cfg);
  }
}

// Report and notification recipients: the report list, or the admin email
export const recipientsFor = (cfg) => (cfg.reportRecipients?.length ? cfg.reportRecipients : [cfg.adminEmail]);

export async function sendMail({ to, subject, html, text, replyTo }) {
  const info = await withTransport((transporter, cfg) =>
    transporter.sendMail({
      from: { name: cfg.fromName || siteConfig.name, address: cfg.fromEmail || cfg.user },
      to: to || cfg.adminEmail,
      subject,
      html,
      text,
      ...(replyTo && { replyTo }),
    })
  );
  return { messageId: info.messageId, accepted: info.accepted };
}

// Checks the SMTP login without sending anything
export async function verifySmtp() {
  await withTransport((transporter) => transporter.verify());
  return true;
}

// Turns SMTP errors into a message an admin can act on
export function smtpErrorMessage(error) {
  if (error instanceof HttpError) return error.message;
  const code = error?.code || error?.responseCode;
  if (code === 'EAUTH' || code === 535) return 'The mail server rejected the username or password.';
  if (code === 'ESOCKET' || code === 'ECONNECTION' || code === 'ETIMEDOUT' || code === 'ECONNREFUSED')
    return 'Could not connect to the mail server — check the server name, port and SSL setting.';
  return error?.message || 'Could not send the email.';
}
