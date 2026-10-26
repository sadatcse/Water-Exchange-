'use client';
import { useState } from 'react';
import { FaSearch, FaShareAlt, FaGoogle } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import useSubmit from '@/hooks/useSubmit';
import { apiSecure } from '@/lib/api-client';
import { siteConfig } from '@/config/site';
import { toCsv, fromCsv } from '@/lib/form-lines';
import SettingsSection from '@/components/dashboard/SettingsSection';
import ImageField from '@/components/dashboard/ImageField';
import { Input, Textarea, Checkbox } from '@/components/forms/FormField';
import { FormSkeleton } from '@/components/loading/PageSkeletons';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';

const counter = (value, ideal) => (
  <span className={value.length > ideal ? 'text-amber-600' : 'text-subtle'}>
    {value.length} / {ideal} characters
  </span>
);

function SeoForm({ initial, onSaved }) {
  const [form, setForm] = useState(() => ({ ...initial, keywords: toCsv(initial.keywords) }));
  const { run, busy, error } = useSubmit();
  const [success, setSuccess] = useState('');
  const field = (key) => ({ name: key, value: form[key] ?? '', onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) });
  const host = siteConfig.url.replace(/^https?:\/\//, '');

  const save = async () => {
    setSuccess('');
    const res = await run(() => apiSecure.put('/settings/seo', { ...form, keywords: fromCsv(form.keywords) }));
    if (!res) return;
    onSaved(res.data.data);
    setForm({ ...res.data.data, keywords: toCsv(res.data.data.keywords) });
    setSuccess('Saved — search engines pick up changes the next time they crawl the site.');
  };

  const footer = (
    <>
      <div className="mr-auto min-w-0 flex-1">
        <Alert type="error" className="py-1.5">{error}</Alert>
        <Alert type="success" className="py-1.5">{success}</Alert>
      </div>
      <Button onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save SEO settings'}</Button>
    </>
  );

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SettingsSection icon={FaSearch} title="Search results" description="How the home page appears on Google. Other pages use their own title and description automatically.">
        <div className="space-y-4">
          <div>
            <Input label="Site title" required maxLength={120} {...field('title')} />
            <p className="mt-1 text-xs">{counter(form.title || '', 60)}</p>
          </div>
          <div>
            <Textarea label="Meta description" required rows={3} maxLength={320} {...field('description')} />
            <p className="mt-1 text-xs">{counter(form.description || '', 160)}</p>
          </div>
          <Textarea label="Keywords (comma separated)" rows={3} {...field('keywords')} />
          {/* Google-style preview */}
          <div className="rounded-lg border border-line/10 bg-surface p-4">
            <p className="text-xs uppercase tracking-wide text-subtle">Preview</p>
            <p className="mt-2 truncate text-xs text-body">{host}</p>
            <p className="truncate text-lg text-[#1a0dab] dark:text-[#8ab4f8]">{form.title || 'Site title'}</p>
            <p className="line-clamp-2 text-sm text-muted">{form.description || 'Meta description'}</p>
          </div>
          <Checkbox
            label="Allow search engines to index the site"
            description="Turn off only for a test copy — it hides the whole site from Google."
            name="allowIndexing"
            checked={form.allowIndexing}
            onChange={(e) => setForm((f) => ({ ...f, allowIndexing: e.target.checked }))}
          />
        </div>
      </SettingsSection>

      <div className="space-y-6">
        <SettingsSection icon={FaShareAlt} title="Sharing & social" description="The image and links used when the site is shared on Facebook, LinkedIn, WhatsApp or X.">
          <div className="space-y-4">
            <ImageField
              label="Share image"
              name="ogImage"
              value={form.ogImage}
              onChange={(ogImage) => setForm((f) => ({ ...f, ogImage }))}
              hint="1200 × 630 px works best. Products and blog posts use their own image."
              aspect="aspect-[1200/630]"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Facebook page" placeholder="https://facebook.com/…" {...field('facebook')} />
              <Input label="LinkedIn page" placeholder="https://linkedin.com/company/…" {...field('linkedin')} />
              <Input label="YouTube channel" placeholder="https://youtube.com/@…" {...field('youtube')} />
              <Input label="X (Twitter) username" placeholder="waterexchange" {...field('twitter')} />
            </div>
            <p className="text-xs text-subtle">Filled-in links also appear as icons in the website footer.</p>
          </div>
        </SettingsSection>

        <SettingsSection icon={FaGoogle} title="Search engine verification" description="Proves to Google and Bing that you own the site, so you can see search keywords and indexing reports." footer={footer}>
          <div className="space-y-4">
            <div>
              <Input label="Google Search Console code" placeholder='Paste the code or the whole <meta name="google-site-verification" …> tag' {...field('googleVerification')} />
              <p className="mt-1 text-xs text-subtle">
                In <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline dark:text-primary-400">Search Console</a> add the property {siteConfig.url}, choose “HTML tag”, paste it here, save, then press Verify. Submit <code>{siteConfig.url}/sitemap.xml</code> afterwards.
              </p>
            </div>
            <Input label="Bing Webmaster code" placeholder="msvalidate.01 code" {...field('bingVerification')} />
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}

export default function SeoSettings() {
  const { data, setData, loading, error } = useApi('/settings/seo', { select: (res) => res.data });
  if (loading) return <FormSkeleton cards={2} />;
  if (error || !data) return <Alert type="error">{error || 'Could not load the SEO settings.'}</Alert>;
  return <SeoForm initial={data} onSaved={setData} />;
}
