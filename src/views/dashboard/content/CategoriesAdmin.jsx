'use client';
import { useState } from 'react';
import { FaPlus, FaEdit, FaTrashAlt, FaLevelUpAlt, FaFolderOpen } from 'react-icons/fa';
import useProductCategories from '@/hooks/useProductCategories';
import useSubmit from '@/hooks/useSubmit';
import { apiSecure } from '@/lib/api-client';
import { CATEGORY_ICONS, CategoryIcon, categoryOptions, flattenTree } from '@/data/product-categories';
import PageTitle from '@/components/dashboard/PageTitle';
import { TableRowsSkeleton } from '@/components/loading/PageSkeletons';
import { Input, Select, Textarea } from '@/components/forms/FormField';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

const EMPTY = { name: '', slug: '', parent: '', icon: 'other', description: '', order: 0 };
const ICON_OPTIONS = Object.entries(CATEGORY_ICONS).map(([value, { label }]) => ({ value, label }));

// Add / edit form. `editing` = the category being edited, or null for a new one.
export function CategoryForm({ categories, editing, initialParent = '', onSaved, onCancel, compact = false }) {
  const [form, setForm] = useState(() => (editing ? { ...EMPTY, ...editing } : { ...EMPTY, parent: initialParent }));
  const { run, busy, error } = useSubmit();
  const field = (key) => ({ name: key, value: form[key] ?? '', onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })) });
  // A category can't be moved under itself or its own sub-categories
  const blocked = editing ? new Set(flattenTree(categories, editing.slug).map((c) => c.slug).concat(editing.slug)) : new Set();
  const parentOptions = [{ value: '', label: 'None — top-level group' }, ...categoryOptions(categories).filter((o) => !blocked.has(o.value))];

  const submit = async (e) => {
    e?.preventDefault();
    const body = { ...form, order: Number(form.order) || 0 };
    const res = await run(() => (editing ? apiSecure.put(`/product-categories/${editing._id}`, body) : apiSecure.post('/product-categories', body)));
    if (res) onSaved(res.data.data);
  };

  // compact = quick add inside the product editor, which is already a <form> (forms can't be nested)
  const Wrapper = compact ? 'div' : 'form';
  return (
    <Wrapper {...(!compact && { onSubmit: submit })} className="space-y-4">
      <div className={cn('grid gap-4', !compact && 'md:grid-cols-2')}>
        <Input label="Name" required maxLength={100} autoFocus {...field('name')} />
        <Select label="Inside" options={parentOptions} {...field('parent')} />
        {!compact && (
          <>
            <Input label="URL slug" maxLength={120} placeholder="Made from the name if left empty" {...field('slug')} />
            <Input label="Display order" type="number" {...field('order')} />
          </>
        )}
        {!form.parent && !compact && <Select label="Icon" options={ICON_OPTIONS} {...field('icon')} />}
      </div>
      {!compact && <Textarea label="Short description (shown on the Products page)" rows={2} maxLength={300} {...field('description')} />}
      <Alert type="error">{error}</Alert>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button {...(compact ? { onClick: submit } : { type: 'submit' })} disabled={busy}>
          {busy ? 'Saving…' : editing ? 'Save category' : 'Add category'}
        </Button>
      </div>
    </Wrapper>
  );
}

export default function CategoriesAdmin() {
  const { data: categories, loading, error, reload } = useProductCategories();
  const del = useSubmit();
  // null = closed · { editing } = edit · { parent } = add (under parent)
  const [panel, setPanel] = useState(null);
  const [notice, setNotice] = useState('');
  const rows = flattenTree(categories);

  const saved = (category) => {
    setNotice(`Saved “${category.name}”.`);
    setPanel(null);
    reload();
  };

  const remove = async (c) => {
    if (!window.confirm(`Delete “${c.name}”?`)) return;
    setNotice('');
    if (await del.run(() => apiSecure.delete(`/product-categories/${c._id}`))) {
      setNotice(`Deleted “${c.name}”.`);
      reload();
    }
  };

  return (
    <>
      <PageTitle
        title="Product categories"
        description={`${categories.length} categories in up to three levels — group › category › sub-category. Products can use any level.`}
        actions={
          <Button onClick={() => setPanel({ parent: '' })}>
            <FaPlus aria-hidden /> Add group
          </Button>
        }
      />
      <Alert type="error" className="mb-4">{error || del.error}</Alert>
      <Alert type="success" className="mb-4">{notice}</Alert>

      {panel && (
        <Card title={panel.editing ? `Edit “${panel.editing.name}”` : panel.parent ? 'Add sub-category' : 'Add top-level group'} className="mb-6">
          <CategoryForm key={panel.editing?._id || `new-${panel.parent}`} categories={categories} editing={panel.editing} initialParent={panel.parent} onSaved={saved} onCancel={() => setPanel(null)} />
        </Card>
      )}

      <Card className="p-0">
        {loading ? (
          <TableRowsSkeleton rows={8} cols={3} />
        ) : !rows.length ? (
          <EmptyState icon={FaFolderOpen} title="No categories yet" description="Add a group, or run `npm run seed` to load the starter tree." />
        ) : (
          <ul className="divide-y divide-line/5">
            {rows.map((c) => {
              return (
                <li key={c._id} className={cn('flex items-center gap-3 px-4 py-2.5', c.depth === 0 && 'bg-canvas/60')}>
                  <div className="flex min-w-0 flex-1 items-center gap-2.5" style={{ paddingLeft: `${c.depth * 1.75}rem` }}>
                    {c.depth === 0 ? (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300">
                        <CategoryIcon name={c.icon} />
                      </span>
                    ) : (
                      <FaLevelUpAlt className="shrink-0 rotate-90 text-xs text-faint" aria-hidden />
                    )}
                    <div className="min-w-0">
                      <p className={cn('truncate text-sm text-ink', c.depth === 0 ? 'font-bold' : 'font-medium')}>{c.name}</p>
                      {c.description && <p className="truncate text-xs text-subtle">{c.description}</p>}
                    </div>
                  </div>
                  <span className="hidden shrink-0 text-xs text-subtle sm:block" title="Products in this category and below">
                    {c.totalProducts} {c.totalProducts === 1 ? 'product' : 'products'}
                  </span>
                  <div className="flex shrink-0 items-center gap-1">
                    {c.depth < 2 && (
                      <button type="button" onClick={() => setPanel({ parent: c.slug })} className="rounded-lg p-2 text-muted hover:bg-line/10 hover:text-ink" aria-label={`Add a sub-category to ${c.name}`} title="Add sub-category">
                        <FaPlus className="text-xs" aria-hidden />
                      </button>
                    )}
                    <button type="button" onClick={() => setPanel({ editing: c })} className="rounded-lg p-2 text-muted hover:bg-line/10 hover:text-ink" aria-label={`Edit ${c.name}`} title="Edit">
                      <FaEdit aria-hidden />
                    </button>
                    <button type="button" onClick={() => remove(c)} disabled={del.busy} className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-500/10" aria-label={`Delete ${c.name}`} title="Delete">
                      <FaTrashAlt className="text-xs" aria-hidden />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
