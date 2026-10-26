'use client';
import { useState } from 'react';
import { FaEnvelope, FaChartLine, FaPaperPlane, FaEye, FaCopy, FaCheck } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import useSubmit from '@/hooks/useSubmit';
import { apiSecure } from '@/lib/api-client';
import { toCsv, fromCsv } from '@/lib/form-lines';
import SettingsSection from '@/components/dashboard/SettingsSection';
import { Input, Checkbox } from '@/components/forms/FormField';
import { FormSkeleton } from '@/components/loading/PageSkeletons';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';

// Form ⇄ API: the password is write-only (blank = keep the saved one)
const toForm = (s) => ({ ...s, password: '', reportRecipients: toCsv(s.reportRecipients) });
const toBody = (f) => ({ ...f, port: Number(f.port) || 465, reportRecipients: fromCsv(f.reportRecipients) });

function CopyBox({ value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the text can still be selected */
    }
  };
  return (
    <div className="flex items-start gap-2 rounded-lg border border-line/10 bg-canvas p-3">
      <code className="min-w-0 flex-1 break-all font-mono text-xs text-ink">{value}</code>
      <button type="button" onClick={copy} className="shrink-0 rounded p-1.5 text-subtle hover:bg-line/10 hover:text-ink" aria-label="Copy">
        {copied ? <FaCheck className="text-green-600" aria-hidden /> : <FaCopy aria-hidden />}
      </button>
    </div>
  );
}

function EmailForm({ initial, onSaved }) {
  const [form, setForm] = useState(() => toForm(initial));
  const save = useSubmit();
  const action = useSubmit();
  const [notice, setNotice] = useState({ type: '', message: '' });
  const state = useApi('/reports/state', { initialData: {}, select: (res) => res.data });
  const field = (key) => ({ name: key, value: form[key] ?? '', onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) });
  const toggle = (key) => ({ name: key, checked: Boolean(form[key]), onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.checked })) });
  const dirty = JSON.stringify(toBody(form)) !== JSON.stringify(toBody(toForm(initial)));

  const persist = async () => {
    setNotice({ type: '', message: '' });
    const res = await save.run(() => apiSecure.put('/settings/email', toBody(form)));
    if (!res) return false;
    onSaved(res.data.data);
    setForm(toForm(res.data.data));
    setNotice({ type: 'success', message: 'Email settings saved.' });
    return true;
  };

  // Test / send-now use the saved settings, so unsaved changes are saved first
  const runAction = async (request) => {
    if (dirty && !(await persist())) return;
    setNotice({ type: '', message: '' });
    const res = await action.run(request);
    if (res) {
      setNotice({ type: 'success', message: res.data.message });
      state.reload();
    }
  };

  const error = save.error || action.error;
  const footer = (
    <>
      <div className="mr-auto min-w-0 flex-1">
        <Alert type="error" className="py-1.5">{error}</Alert>
        {!error && <Alert type={notice.type || 'info'} className="py-1.5">{notice.message}</Alert>}
      </div>
      <Button onClick={persist} disabled={save.busy}>{save.busy ? 'Saving…' : 'Save email settings'}</Button>
    </>
  );

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SettingsSection icon={FaEnvelope} title="Email sending (SMTP)" description="The mailbox the website sends from — contact alerts and reports." footer={footer}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_7rem]">
            <Input label="Outgoing (SMTP) server" placeholder="mail.waterexchangebd.com" {...field('host')} />
            <Input label="Port" type="number" {...field('port')} />
          </div>
          <Checkbox label="Use SSL" description="On for port 465. Off for port 587 (STARTTLS is used automatically)." {...toggle('secure')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Username" autoComplete="off" placeholder="info@waterexchangebd.com" {...field('user')} />
            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder={initial.hasPassword ? '•••••••• saved — leave empty to keep' : 'Mailbox password'}
              {...field('password')}
            />
            <Input label="From name" placeholder="Water Exchange" {...field('fromName')} />
            <Input label="From address" type="email" placeholder="info@waterexchangebd.com" {...field('fromEmail')} />
          </div>
          <div className="border-t border-line/10 pt-4">
            <Input label="Web admin email" type="email" required placeholder="team.waterexchange@gmail.com" {...field('adminEmail')} />
            <p className="mt-1 text-xs text-subtle">Receives contact-request alerts, test emails and (unless recipients are set below) the reports.</p>
          </div>
          <Checkbox label="Email me every new contact request" description="Sent to the admin email with the visitor as Reply-To." {...toggle('notifyContact')} />
          <Button variant="secondary" disabled={action.busy} onClick={() => runAction(() => apiSecure.post('/email/test', {}))}>
            <FaPaperPlane aria-hidden /> {action.busy ? 'Working…' : `Send a test email to ${form.adminEmail || 'the admin'}`}
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection icon={FaChartLine} title="Visitor & contact reports" description="Website visitors, search-engine visitors, sources, pages, countries, devices, contact requests and sign-ins.">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Checkbox label="Weekly report" description="Every Monday, for the previous Monday–Sunday." {...toggle('weeklyReport')} />
            <Checkbox label="Monthly report" description="On the 1st, for the previous month." {...toggle('monthlyReport')} />
          </div>
          <div>
            <Input label="Send reports to (comma separated)" placeholder={form.adminEmail || 'Admin email'} {...field('reportRecipients')} />
            <p className="mt-1 text-xs text-subtle">Leave empty to send them to the web admin email. Save after changing.</p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {['weekly', 'monthly'].map((period) => (
              <div key={period} className="rounded-lg border border-line/10 p-3">
                <p className="text-sm font-semibold capitalize text-ink">{period} report</p>
                <p className="text-xs text-subtle">
                  Last sent for: {state.data?.[period] || 'not sent yet'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {/* Plain link: an API route, opened in a new tab (no client-side prefetch) */}
                  <a
                    href={`/api/reports/preview?period=${period}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-line/20 bg-surface px-3 py-1.5 text-sm font-semibold text-body hover:bg-line/5"
                  >
                    <FaEye aria-hidden /> Preview
                  </a>
                  <Button size="sm" disabled={action.busy} onClick={() => runAction(() => apiSecure.post('/reports/send', { period }))}>
                    <FaPaperPlane aria-hidden /> Send now
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-line/10 pt-4">
            <p className="text-sm font-semibold text-ink">Automatic sending (cPanel cron job)</p>
            <p className="mt-1 text-xs text-subtle">
              In cPanel → Cron Jobs, add this command to run <b>once a day</b> (e.g. 08:00). It sends each report once, when its week or month is complete.
            </p>
            <div className="mt-2">
              {initial.cronUrl ? (
                <CopyBox value={`curl -fsS "${initial.cronUrl}" > /dev/null 2>&1`} />
              ) : (
                <Alert type="warning">CRON_SECRET is not set in the server’s .env file.</Alert>
              )}
            </div>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}

export default function EmailSettings() {
  const { data, setData, loading, error } = useApi('/settings/email', { select: (res) => res.data });
  if (loading) return <FormSkeleton cards={2} />;
  if (error || !data) return <Alert type="error">{error || 'Could not load the email settings.'}</Alert>;
  return <EmailForm initial={data} onSaved={setData} />;
}
