'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useApi from '@/hooks/useApi';
import useSubmit from '@/hooks/useSubmit';
import { apiSecure } from '@/lib/api-client';
import { BLOG_CATEGORIES, BLOG_CATEGORY_OPTIONS } from '@/config/blog';
import { toCsv, fromCsv } from '@/lib/form-lines';
import EditorShell from '@/components/dashboard/EditorShell';
import ImageField from '@/components/dashboard/ImageField';
import { Input, Textarea, Select, Checkbox } from '@/components/forms/FormField';
import Card from '@/components/ui/Card';

// <input type="date"> value (local day) ⇄ ISO date
const toDateInput = (value) => {
  const d = value ? new Date(value) : new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

const EMPTY = { title: '', slug: '', category: BLOG_CATEGORIES[0], coverImage: '', excerpt: '', content: '', author: 'Water Exchange', tags: [], published: true, publishedAt: null };

const toForm = (p) => ({ ...p, tags: toCsv(p.tags), publishedAt: toDateInput(p.publishedAt) });
const toBody = (f) => ({
  title: f.title, slug: f.slug, category: f.category, coverImage: f.coverImage, excerpt: f.excerpt, content: f.content,
  author: f.author, tags: fromCsv(f.tags), published: f.published, publishedAt: f.publishedAt,
});

const wordCount = (text) => text.split(/\s+/).filter(Boolean).length;

function BlogForm({ id, initial }) {
  const router = useRouter();
  const [form, setForm] = useState(() => toForm(initial));
  const { run, busy, error } = useSubmit();
  const [success, setSuccess] = useState('');
  const field = (key) => ({ name: key, value: form[key], onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) });
  const words = wordCount(form.content);

  const submit = async () => {
    setSuccess('');
    const res = await run(() => (id ? apiSecure.put(`/blog/${id}`, toBody(form)) : apiSecure.post('/blog', toBody(form))));
    if (!res) return;
    if (id) {
      setForm(toForm(res.data.data));
      setSuccess(res.data.message);
    } else {
      router.push('/dashboard/blog');
    }
  };

  return (
    <EditorShell
      title={id ? 'Edit post' : 'New post'}
      description="Write in plain text — the formatting guide is under the content box."
      backHref="/dashboard/blog"
      backLabel="All posts"
      isNew={!id}
      busy={busy}
      error={error}
      success={success}
      onSubmit={submit}
    >
      <Card title="Post">
        <div className="grid gap-4">
          <Input label="Title" required maxLength={200} {...field('title')} />
          <div className="grid gap-4 md:grid-cols-3">
            <Input label="URL slug" maxLength={160} placeholder="Made from the title if left empty" {...field('slug')} />
            <Select label="Category" required options={BLOG_CATEGORY_OPTIONS} {...field('category')} />
            <Input label="Author" maxLength={120} {...field('author')} />
          </div>
          <ImageField label="Cover image" name="coverImage" value={form.coverImage} onChange={(coverImage) => setForm((f) => ({ ...f, coverImage }))} required aspect="aspect-[16/10]" />
          <Textarea label="Excerpt" required rows={2} maxLength={400} placeholder="One or two sentences shown on the blog cards" {...field('excerpt')} />
          <div>
            <Textarea label="Content" required rows={18} className="font-mono text-[13px] leading-6" {...field('content')} />
            <div className="mt-2 flex flex-col gap-1 text-xs text-subtle sm:flex-row sm:justify-between">
              <span>
                Blank line = new paragraph · <code>## Heading</code> on its own line · <code>- item</code> for bullet points
              </span>
              <span>
                {words} words · about {Math.max(1, Math.round(words / 200))} min read
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Publishing">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Publish date" type="date" {...field('publishedAt')} />
          <Input label="Tags (comma separated)" placeholder="ETP, DOE, Textiles" {...field('tags')} />
        </div>
        <Checkbox
          className="mt-4"
          label="Published"
          description="Drafts are hidden from the website. A post with a future date goes live on that day."
          name="published"
          checked={form.published}
          onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
        />
      </Card>
    </EditorShell>
  );
}

// id = post id to edit, or undefined for a new post
export default function BlogEditor({ id }) {
  const { data, loading, error } = useApi(id ? `/blog/${id}` : null, { select: (res) => res.data });
  if (id && (loading || error || !data)) {
    return <EditorShell title="Edit post" backHref="/dashboard/blog" backLabel="All posts" loading={loading} loadError={error || (!loading && 'Post not found.')} />;
  }
  return <BlogForm key={id || 'new'} id={id} initial={data || EMPTY} />;
}
