'use client';
import { useRouter } from 'next/navigation';
import { FaPlus, FaStar } from 'react-icons/fa';
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

const initials = (name) => name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

export function MemberAvatar({ member, size = 'h-10 w-10' }) {
  return member.photo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={member.photo} alt="" className={`${size} shrink-0 rounded-full bg-canvas object-cover`} />
  ) : (
    <span className={`${size} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-700 to-cyan-500 text-xs font-bold text-white`}>
      {initials(member.name)}
    </span>
  );
}

export default function TeamAdmin() {
  const router = useRouter();
  const { data: members, loading, error, reload } = useApi('/team', { initialData: [], select: (res) => res.data });
  const { run, busy, error: deleteError } = useSubmit();

  const remove = async (m) => {
    if (await run(() => apiSecure.delete(`/team/${m._id}`))) reload();
  };

  const columns = [
    {
      key: 'name',
      header: 'Member',
      render: (m) => (
        <div className="flex items-center gap-3">
          <MemberAvatar member={m} />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate font-medium text-ink">
              {m.name} {m.featured && <FaStar className="text-amber-500" title="Featured (large card)" aria-label="Featured" />}
            </p>
            <p className="truncate text-xs text-subtle">{m.credentials}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role' },
    { key: 'published', header: 'Status', render: (m) => <Badge color={m.published ? 'green' : 'amber'}>{m.published ? 'Shown' : 'Hidden'}</Badge> },
    { key: 'order', header: 'Order', className: 'text-center', hideOnMobile: true },
    {
      key: 'actions',
      header: '',
      render: (m) => <RowActions editHref={`/dashboard/team/${m._id}`} onDelete={() => remove(m)} deleting={busy} label="team member" />,
    },
  ];

  return (
    <>
      <PageTitle
        title="Team"
        description="“Meet the team” on the home and About pages. The featured member gets the large card."
        actions={
          <Button href="/dashboard/team/new">
            <FaPlus aria-hidden /> Add member
          </Button>
        }
      />
      <Alert type="error" className="mb-4">{error || deleteError}</Alert>
      <Card className="p-0">
        <DataTable
          columns={columns}
          rows={members}
          loading={loading}
          onRowClick={(m) => router.push(`/dashboard/team/${m._id}`)}
          emptyTitle="No team members yet"
          emptyDescription="Add the people who should appear on the website."
        />
      </Card>
    </>
  );
}
