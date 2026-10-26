'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import useSubmit from '@/hooks/useSubmit';
import { apiSecure } from '@/lib/api-client';
import useProductCategories from '@/hooks/useProductCategories';
import { categoryOptions, descendantSlugs } from '@/data/product-categories';
import { formatDate } from '@/lib/utils';
import PageTitle from '@/components/dashboard/PageTitle';
import DataTable from '@/components/dashboard/DataTable';
import FilterBar from '@/components/dashboard/FilterBar';
import RowActions from '@/components/dashboard/RowActions';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

// The catalogue is small (tens of products), so it is loaded once and filtered in the browser
export default function ProductsAdmin() {
  const router = useRouter();
  const { data: products, loading, error, reload } = useApi('/products', { initialData: [], select: (res) => res.data });
  const { run, busy, error: deleteError } = useSubmit();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { data: categories } = useProductCategories();

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    // A category filter includes its sub-categories
    const inCategory = category ? new Set(descendantSlugs(categories, category)) : null;
    return products.filter((p) => (!inCategory || inCategory.has(p.category)) && (!q || `${p.name} ${p.brand} ${p.origin}`.toLowerCase().includes(q)));
  }, [products, categories, search, category]);

  const remove = async (p) => {
    if (await run(() => apiSecure.delete(`/products/${p._id}`))) reload();
  };

  const columns = [
    {
      key: 'name',
      header: 'Product',
      render: (p) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt="" className="h-12 w-16 shrink-0 rounded-md bg-canvas object-cover" />
          <div className="min-w-0">
            <p className="truncate font-medium text-ink">{p.name}</p>
            <p className="truncate text-xs text-subtle">{[p.brand, p.origin].filter(Boolean).join(' · ')}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (p) =>
        p.categoryInfo ? (
          <div className="min-w-0">
            <p className="text-ink-2">{p.categoryInfo.name}</p>
            {p.categoryInfo.path.length > 1 && <p className="text-xs text-subtle">{p.categoryInfo.path.slice(0, -1).map((c) => c.name).join(' › ')}</p>}
          </div>
        ) : (
          <span className="text-amber-600">No category</span>
        ),
    },
    { key: 'published', header: 'Status', render: (p) => <Badge color={p.published ? 'green' : 'amber'}>{p.published ? 'Published' : 'Draft'}</Badge> },
    { key: 'order', header: 'Order', className: 'text-center', hideOnMobile: true },
    { key: 'updatedAt', header: 'Updated', className: 'whitespace-nowrap', render: (p) => formatDate(p.updatedAt) },
    {
      key: 'actions',
      header: '',
      render: (p) => (
        <RowActions editHref={`/dashboard/products/${p._id}`} viewHref={p.published ? `/products/${p.slug}` : undefined} onDelete={() => remove(p)} deleting={busy} label="product" />
      ),
    },
  ];

  return (
    <>
      <PageTitle
        title="Products"
        description="Equipment shown on the website — the home page slider, the Products page and each product page."
        actions={
          <Button href="/dashboard/products/new">
            <FaPlus aria-hidden /> Add product
          </Button>
        }
      />
      <Alert type="error" className="mb-4">{error || deleteError}</Alert>
      <Card className="p-0">
        <FilterBar
          search={search}
          onSearch={setSearch}
          placeholder="Search by name, brand or origin…"
          filters={[{ key: 'category', value: category, onChange: setCategory, options: [{ value: '', label: 'All categories' }, ...categoryOptions(categories)] }]}
        />
        <DataTable
          columns={columns}
          rows={rows}
          loading={loading}
          onRowClick={(p) => router.push(`/dashboard/products/${p._id}`)}
          emptyTitle={products.length ? 'No products match' : 'No products yet'}
          emptyDescription={products.length ? 'Try another search or category.' : 'Add your first product, or run `npm run seed` to load the starter catalogue.'}
        />
      </Card>
    </>
  );
}
