'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import useSubmit from '@/hooks/useSubmit';
import { apiSecure } from '@/lib/api-client';
import useProductCategories from '@/hooks/useProductCategories';
import { categoryOptions } from '@/data/product-categories';
import { CategoryForm } from '@/views/dashboard/content/CategoriesAdmin';
import { toLines, fromLines, toParagraphs, fromParagraphs, pairsToLines, linesToPairs, toCsv, fromCsv } from '@/lib/form-lines';
import EditorShell from '@/components/dashboard/EditorShell';
import ImageField from '@/components/dashboard/ImageField';
import { Input, Textarea, Checkbox } from '@/components/forms/FormField';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const EMPTY = {
  name: '', slug: '', category: '', image: '', brand: '', origin: '', summary: '', question: '',
  overview: [], distinction: { text: '', see: [] }, highlights: [], features: [], specs: [], applications: [], order: 0, published: true,
};

// Product document → form fields (lists become one-per-line text)
const toForm = (p) => ({
  name: p.name, slug: p.slug, category: p.category, image: p.image, brand: p.brand, origin: p.origin, summary: p.summary, question: p.question,
  overview: toParagraphs(p.overview), distinctionText: p.distinction?.text || '', distinctionSee: toCsv(p.distinction?.see),
  highlights: pairsToLines(p.highlights), features: toLines(p.features), specs: pairsToLines(p.specs), applications: toLines(p.applications),
  order: p.order, published: p.published,
});

const toBody = (f) => ({
  name: f.name, slug: f.slug, category: f.category, image: f.image, brand: f.brand, origin: f.origin, summary: f.summary, question: f.question,
  overview: fromParagraphs(f.overview), distinction: { text: f.distinctionText, see: fromCsv(f.distinctionSee) },
  highlights: linesToPairs(f.highlights), features: fromLines(f.features), specs: linesToPairs(f.specs), applications: fromLines(f.applications),
  order: Number(f.order) || 0, published: f.published,
});

// Indented category select (group › category › sub-category) with a quick "add category" form
function CategoryPicker({ value, onChange }) {
  const { data: categories, loading, reload } = useProductCategories();
  const [adding, setAdding] = useState(false);

  return (
    <div className="md:col-span-2">
      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-body">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-line/20 bg-surface px-3 py-2 text-sm text-ink focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
          >
            <option value="">{loading ? 'Loading categories…' : 'Choose a category…'}</option>
            {categoryOptions(categories).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <Button variant="secondary" onClick={() => setAdding((a) => !a)} aria-expanded={adding}>
          <FaPlus aria-hidden /> New category
        </Button>
      </div>
      <p className="mt-1 text-xs text-subtle">
        Pick the most specific match — the product also shows under its parent categories. <Link href="/dashboard/product-categories" className="text-primary-600 hover:underline dark:text-primary-400">Manage categories</Link>
      </p>
      {adding && (
        <div className="mt-3 rounded-lg border border-line/10 bg-canvas p-4">
          <CategoryForm
            compact
            categories={categories}
            editing={null}
            initialParent={value}
            onCancel={() => setAdding(false)}
            onSaved={(category) => {
              reload();
              onChange(category.slug);
              setAdding(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function ProductForm({ id, initial }) {
  const router = useRouter();
  const [form, setForm] = useState(() => toForm(initial));
  const { run, busy, error } = useSubmit();
  const [success, setSuccess] = useState('');
  const field = (key) => ({ name: key, value: form[key], onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) });

  const submit = async () => {
    setSuccess('');
    const res = await run(() => (id ? apiSecure.put(`/products/${id}`, toBody(form)) : apiSecure.post('/products', toBody(form))));
    if (!res) return;
    if (id) {
      setForm(toForm(res.data.data));
      setSuccess(res.data.message);
    } else {
      router.push('/dashboard/products');
    }
  };

  return (
    <EditorShell
      title={id ? `Edit: ${initial.name}` : 'Add product'}
      description="Fields marked * are required. Everything else is optional and only shows on the product page when filled in."
      backHref="/dashboard/products"
      backLabel="All products"
      isNew={!id}
      busy={busy}
      error={error}
      success={success}
      onSubmit={submit}
    >
      <Card title="Basics">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" required maxLength={160} {...field('name')} />
          <Input label="URL slug" maxLength={120} placeholder="Made from the name if left empty" {...field('slug')} />
          <CategoryPicker value={form.category} onChange={(category) => setForm((f) => ({ ...f, category }))} />
          <Input label="Display order" type="number" {...field('order')} />
          <Input label="Brand" maxLength={160} {...field('brand')} />
          <Input label="Country of origin" maxLength={120} {...field('origin')} />
        </div>
        <div className="mt-4">
          <ImageField label="Image" name="image" value={form.image} onChange={(image) => setForm((f) => ({ ...f, image }))} required />
        </div>
        <div className="mt-4">
          <Textarea label="Summary" required rows={2} maxLength={400} {...field('summary')} />
        </div>
        <Checkbox
          className="mt-4"
          label="Published"
          description="Unpublished products are hidden from the website."
          name="published"
          checked={form.published}
          onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
        />
      </Card>

      <Card title="Product page">
        <div className="grid gap-4">
          <Input label="Overview heading" maxLength={200} placeholder="What is a Roots air blower?" {...field('question')} />
          <Textarea label="Overview" rows={6} placeholder="Paragraphs — leave a blank line between them" {...field('overview')} />
          <div className="grid gap-4 md:grid-cols-2">
            <Textarea label="Key figures (up to 3)" rows={3} placeholder={'Capacity: 1–70 m³/min\nPower: Up to 300 HP'} {...field('highlights')} />
            <Textarea label="Specifications" rows={3} placeholder={'Type: Rotary lobe blower\nMaterial: Cast iron'} {...field('specs')} />
            <Textarea label="Key features" rows={4} placeholder="One per line" {...field('features')} />
            <Textarea label="Where it’s used" rows={4} placeholder="One per line" {...field('applications')} />
          </div>
          <p className="-mt-2 text-xs text-subtle">Key figures and specifications: one per line, written as “Label: value”.</p>
        </div>
      </Card>

      <Card title="Don’t confuse it with">
        <div className="grid gap-4">
          <Textarea label="Explanation" rows={3} maxLength={1000} {...field('distinctionText')} />
          <Input label="Compare with (product slugs, comma separated)" placeholder="turbo-blower, air-diffuser" {...field('distinctionSee')} />
        </div>
      </Card>
    </EditorShell>
  );
}

// id = product id to edit, or undefined for a new product
export default function ProductEditor({ id }) {
  const { data, loading, error } = useApi(id ? `/products/${id}` : null, { select: (res) => res.data });
  if (id && (loading || error || !data)) {
    return <EditorShell title="Edit product" backHref="/dashboard/products" backLabel="All products" loading={loading} loadError={error || (!loading && 'Product not found.')} />;
  }
  return <ProductForm key={id || 'new'} id={id} initial={data || EMPTY} />;
}
