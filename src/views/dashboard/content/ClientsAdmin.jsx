'use client';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import useSubmit from '@/hooks/useSubmit';
import { apiSecure } from '@/lib/api-client';
import PageTitle from '@/components/dashboard/PageTitle';
import DataTable from '@/components/dashboard/DataTable';
import RowActions from '@/components/dashboard/RowActions';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

export default function ClientsAdmin() {
  const router = useRouter();
  const { data: clients, loading, error, reload } = useApi('/clients', { initialData: [], select: (res) => res.data });
  const { run, busy, error: deleteError } = useSubmit();

  const remove = async (c) => {
    if (await run(() => apiSecure.delete(`/clients/${c._id}`))) reload();
  };

  const columns = [
    {
      key: 'name',
      header: 'Client',
      render: (c) => (
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-20 shrink-0 items-center justify-center rounded-md border border-line/10 bg-white p-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.logo} alt="" className="max-h-full max-w-full object-contain" />
          </span>
          <p className="truncate font-medium text-ink">{c.name || <span className="italic text-subtle">Logo only (no name)</span>}</p>
        </div>
      ),
    },
    { key: 'sector', header: 'Sector' },
    { key: 'published', header: 'Status', render: (c) => <Badge color={c.published ? 'green' : 'amber'}>{c.published ? 'Shown' : 'Hidden'}</Badge> },
    { key: 'order', header: 'Order', className: 'text-center', hideOnMobile: true },
    {
      key: 'actions',
      header: '',
      render: (c) => <RowActions editHref={`/dashboard/clients/${c._id}`} viewHref="/clients" onDelete={() => remove(c)} deleting={busy} label="client" />,
    },
  ];

  return (
    <>
      <PageTitle
        title="Clients"
        description="“Our happy clients” — the logo strip on the home page and the grid on the Clients page."
        actions={
          <Button href="/dashboard/clients/new">
            <FaPlus aria-hidden /> Add client
          </Button>
        }
      />
      <Alert type="error" className="mb-4">{error || deleteError}</Alert>
      <Card className="p-0">
        <DataTable
          columns={columns}
          rows={clients}
          loading={loading}
          onRowClick={(c) => router.push(`/dashboard/clients/${c._id}`)}
          emptyTitle="No clients yet"
          emptyDescription="Add client logos to show on the website."
        />
      </Card>
    </>
  );
}
