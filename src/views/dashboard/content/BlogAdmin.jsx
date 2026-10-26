'use client';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import useFilters from '@/hooks/useFilters';
import useServerPage from '@/hooks/useServerPage';
import useSubmit from '@/hooks/useSubmit';
import { apiSecure } from '@/lib/api-client';
import { BLOG_CATEGORY_OPTIONS } from '@/config/blog';
import { formatDate } from '@/lib/utils';
import PageTitle from '@/components/dashboard/PageTitle';
import DataTable from '@/components/dashboard/DataTable';
import FilterBar from '@/components/dashboard/FilterBar';
import Pagination from '@/components/dashboard/Pagination';
import RowActions from '@/components/dashboard/RowActions';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const PER_PAGE = 15;
const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
];

const isScheduled = (p) => p.published && new Date(p.publishedAt) > new Date();

export default function BlogAdmin() {
  const router = useRouter();
  const { filters, set, search, setSearch, query } = useFilters({ search: '', category: '', status: '' });
  const { page, setPage } = useServerPage(query);
  const { data, loading, error, reload } = useApi(`/blog?${query}&page=${page}&limit=${PER_PAGE}`, {
    initialData: { rows: [], total: 0, pageCount: 1 },
    select: (res) => res.data,
  });
  const { run, busy, error: deleteError } = useSubmit();

  const remove = async (post) => {
    if (await run(() => apiSecure.delete(`/blog/${post._id}`))) reload();
  };

  const columns = [
    {
      key: 'title',
      header: 'Post',
      render: (p) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.coverImage} alt="" className="h-12 w-16 shrink-0 rounded-md bg-canvas object-cover" />
          <div className="min-w-0">
            <p className="line-clamp-2 font-medium text-ink">{p.title}</p>
            <p className="truncate text-xs text-subtle">{p.author}</p>
          </div>
        </div>
      ),
    },
    { key: 'category', header: 'Category' },
    {
      key: 'published',
      header: 'Status',
      render: (p) =>
        isScheduled(p) ? <Badge color="blue">Scheduled</Badge> : <Badge color={p.published ? 'green' : 'amber'}>{p.published ? 'Published' : 'Draft'}</Badge>,
    },
    { key: 'publishedAt', header: 'Date', className: 'whitespace-nowrap', render: (p) => formatDate(p.publishedAt) },
    {
      key: 'actions',
      header: '',
      render: (p) => (
        <RowActions
          editHref={`/dashboard/blog/${p._id}`}
          viewHref={p.published && !isScheduled(p) ? `/blog/${p.slug}` : undefined}
          onDelete={() => remove(p)}
          deleting={busy}
          label="post"
        />
      ),
    },
  ];

  return (
    <>
      <PageTitle
        title="Blog posts"
        description={`${data.total} ${data.total === 1 ? 'post' : 'posts'} · shown on /blog and the latest three on the home page.`}
        actions={
          <Button href="/dashboard/blog/new">
            <FaPlus aria-hidden /> New post
          </Button>
        }
      />
      <Alert type="error" className="mb-4">{error || deleteError}</Alert>
      <Card className="p-0">
        <FilterBar
          search={search}
          onSearch={setSearch}
          placeholder="Search titles, excerpts or authors…"
          filters={[
            { key: 'category', value: filters.category, onChange: set('category'), options: [{ value: '', label: 'All categories' }, ...BLOG_CATEGORY_OPTIONS] },
            { key: 'status', value: filters.status, onChange: set('status'), options: STATUS_OPTIONS },
          ]}
        />
        <DataTable
          columns={columns}
          rows={data.rows}
          loading={loading}
          onRowClick={(p) => router.push(`/dashboard/blog/${p._id}`)}
          emptyTitle="No posts found"
          emptyDescription={query ? 'Try another search or filter.' : 'Write your first post.'}
        />
        <Pagination page={page} pageCount={data.pageCount} onChange={setPage} />
      </Card>
    </>
  );
}
