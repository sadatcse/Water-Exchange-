'use client';
import { useEffect, useMemo, useState } from 'react';
import { FaClock, FaPalette, FaLock } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import { apiSecure, apiError } from '@/lib/api-client';
import { DEFAULT_TIME_ZONE, offsetLabel, setTimeZone } from '@/lib/timezone';
import PageTitle from '@/components/dashboard/PageTitle';
import ThemeToggle from '@/components/layout/ThemeToggle';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { Input } from '@/components/forms/FormField';
import { FormSkeleton } from '@/components/loading/PageSkeletons';

const PINNED_ZONES = ['Asia/Dhaka', 'Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore', 'Europe/London', 'America/New_York', 'UTC'];

function allTimeZones() {
  try {
    const zones = Intl.supportedValuesOf('timeZone');
    return [...PINNED_ZONES, ...zones.filter((z) => !PINNED_ZONES.includes(z))];
  } catch {
    return PINNED_ZONES;
  }
}

function useClock(timeZone) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(new Intl.DateTimeFormat('en-GB', { timeZone, dateStyle: 'full', timeStyle: 'medium' }).format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);
  return now;
}

function Section({ icon: Icon, title, description, children, footer }) {
  return (
    <Card className="p-0">
      <div className="flex items-start gap-3 border-b border-line/10 px-5 py-4">
        <span className="rounded-lg bg-primary-50 p-2.5 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300"><Icon /></span>
        <div>
          <h2 className="text-base">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-subtle">{description}</p>}
        </div>
      </div>
      <div className="px-5 py-5">{children}</div>
      {footer && <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line/10 px-5 py-3">{footer}</div>}
    </Card>
  );
}

function TimezoneSettings() {
  const loaded = useApi('/settings/site', { select: (res) => res.data });
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const zones = useMemo(() => allTimeZones(), []);
  const timeZone = draft ?? loaded.data?.timezone ?? DEFAULT_TIME_ZONE;
  const clock = useClock(timeZone);

  const save = async () => {
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await apiSecure.put('/settings/site', { timezone: timeZone });
      loaded.setData(res.data.data);
      setDraft(null);
      setTimeZone(res.data.data.timezone); // dates in this tab use the new zone right away
      setStatus({ type: 'success', message: 'Saved.' });
    } catch (err) {
      setStatus({ type: 'error', message: apiError(err, 'Could not save.') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section
      icon={FaClock}
      title="Timezone"
      description="Used for every date and time on the site and dashboard."
      footer={
        <>
          <Alert type={status.type || 'info'} className="mr-auto py-1.5">{status.message}</Alert>
          <Button onClick={save} disabled={saving || draft === null}>{saving ? 'Saving…' : 'Save timezone'}</Button>
        </>
      }
    >
      {loaded.loading ? (
        <FormSkeleton cards={1} />
      ) : (
        <>
          <label htmlFor="timezone" className="mb-1 block text-sm font-medium text-body">Site timezone</label>
          <select
            id="timezone"
            value={timeZone}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full rounded-lg border border-line/20 bg-surface px-3 py-2 text-sm text-ink focus:border-primary-500 focus:outline-none"
          >
            {zones.map((z) => (
              <option key={z} value={z}>
                {z.replace(/_/g, ' ')} ({offsetLabel(z)})
              </option>
            ))}
          </select>
          <div className="mt-4 rounded-lg border border-line/10 bg-canvas px-4 py-3">
            <p className="text-xs uppercase tracking-wide text-subtle">Current time in {timeZone.replace(/_/g, ' ')}</p>
            <p className="mt-1 font-mono text-sm text-ink">{clock || '…'}</p>
          </div>
        </>
      )}
    </Section>
  );
}

const EMPTY_PASSWORDS = { currentPassword: '', newPassword: '', confirm: '' };

function PasswordSettings() {
  const [form, setForm] = useState(EMPTY_PASSWORDS);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      setStatus({ type: 'error', message: 'The new passwords do not match.' });
      return;
    }
    setSaving(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await apiSecure.put('/auth/password', { currentPassword: form.currentPassword, newPassword: form.newPassword });
      setForm(EMPTY_PASSWORDS);
      setStatus({ type: 'success', message: res.data?.message || 'Password updated.' });
    } catch (err) {
      setStatus({ type: 'error', message: apiError(err, 'Could not change the password.') });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section icon={FaLock} title="Password" description="Change the password you use to sign in.">
      <form onSubmit={save} className="space-y-4">
        <Input label="Current password" name="currentPassword" type="password" autoComplete="current-password" value={form.currentPassword} onChange={update} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="New password" name="newPassword" type="password" autoComplete="new-password" minLength={8} value={form.newPassword} onChange={update} required />
          <Input label="Repeat new password" name="confirm" type="password" autoComplete="new-password" minLength={8} value={form.confirm} onChange={update} required />
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Alert type={status.type || 'info'} className="mr-auto py-1.5">{status.message}</Alert>
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Update password'}</Button>
        </div>
      </form>
    </Section>
  );
}

export default function SettingsView() {
  return (
    <>
      <PageTitle title="Settings" description="Site-wide options for the website and dashboard." />
      <div className="grid gap-6 xl:grid-cols-2">
        <TimezoneSettings />
        <PasswordSettings />
        <Section icon={FaPalette} title="Appearance" description="Light, dark or follow the device. Saved in this browser for each visitor.">
          <ThemeToggle variant="row" />
          <p className="mt-3 text-xs text-subtle">Visitors switch the theme with the sun / moon button in the site header.</p>
        </Section>
      </div>
    </>
  );
}
