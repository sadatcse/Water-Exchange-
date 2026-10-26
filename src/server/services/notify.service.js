// Email notifications to the website admin. Never throws — a mail problem must not break the request.
import { getEmailConfig } from '@/server/services/settings.service';
import { sendMail } from '@/server/services/mail.service';
import { contactNotification } from '@/server/emails/templates';

export async function notifyNewContact(message) {
  try {
    const cfg = await getEmailConfig();
    if (!cfg.notifyContact || !cfg.adminEmail || !cfg.pass) return;
    await sendMail({ to: cfg.adminEmail, replyTo: message.email, ...contactNotification(message) });
  } catch (error) {
    console.error('Contact notification failed:', error.message);
  }
}
