'use client';
import { useState } from 'react';
import { FaEnvelope, FaEnvelopeOpen, FaReply, FaTrashAlt, FaPhoneAlt, FaTimes, FaInbox } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import useFilters from '@/hooks/useFilters';
import useServerPage from '@/hooks/useServerPage';
import useSubmit from '@/hooks/useSubmit';
import { apiSecure } from '@/lib/api-client';
import { formatDate, cn } from '@/lib/utils';
import PageTitle from '@/components/dashboard/PageTitle';
import StatCard, { StatGrid } from '@/components/dashboard/StatCard';
import DataTable from '@/components/dashboard/DataTable';
import FilterBar from '@/components/dashboard/FilterBar';
import Pagination from '@/components/dashboard/Pagination';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const PER_PAGE = 20;
const STATUS_COLORS = { unread: 'blue', read: 'gray', replied: 'green' };
const STATUS_OPTIONS = [
  { value: '', label: 'All messages' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
];

function MessageDetail({ message, busy, onStatus, onDelete, onClose }) {
  const subject = message.subject || 'Your enquiry';
  const mailto = `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${subject}`)}`;
  return (
    <Card className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-subtle">{formatDate(message.createdAt, true)}</p>
          <h2 className="mt-1 text-lg">{message.subject || '(no subject)'}</h2>
          <p className="mt-1 text-sm text-body">
            <span className="font-semibold text-ink">{message.fullName}</span> ·{' '}
            <a href={`mailto:${message.email}`} className="text-primary-600 hover:underline dark:text-primary-400">{message.email}</a>
            {message.phone && (
              <>
                {' '}·{' '}
                <a href={`tel:${message.phone}`} className="inline-flex items-center gap-1 text-primary-600 hover:underline dark:text-primary-400">
                  <FaPhoneAlt className="text-[10px]" aria-hidden /> {message.phone}
                </a>
              </>
            )}
          </p>
        </div>
        <button type="button" onClick={onClose} className="rounded p-1.5 text-subtle hover:bg-line/10" aria-label="Close message">
          <FaTimes aria-hidden />
        </button>
      </div>
      <p className="mt-4 whitespace-pre-line rounded-lg bg-canvas p-4 text-sm leading-relaxed text-body">{message.message}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button href={mailto} onClick={() => onStatus('replied')}>
          <FaReply aria-hidden /> Reply by email
        </Button>
        {message.status !== 'replied' && (
          <Button variant="secondary" onClick={() => onStatus('replied')} disabled={busy}>
            Mark as replied
          </Button>
        )}
        {message.status !== 'unread' && (
          <Button variant="secondary" onClick={() => onStatus('unread')} disabled={busy}>
            <FaEnvelope aria-hidden /> Mark unread
          </Button>
        )}
        <Button variant="ghost" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" onClick={() => window.confirm('Delete this message?') && onDelete()} disabled={busy}>
          <FaTrashAlt aria-hidden /> Delete
        </Button>
      </div>
    </Card>
  );
}

export default function MessagesAdmin() {
  const { filters, set, search, setSearch, query } = useFilters({ status: '', search: '' });
  const { page, setPage } = useServerPage(query);
  const { data, setData, loading, error, reload } = useApi(`/contact?${query}&page=${page}&limit=${PER_PAGE}`, {
    initialData: { rows: [], total: 0, pageCount: 1, counts: {} },
    select: (res) => res.data,
  });
  const { run, busy, error: actionError } = useSubmit();
  const [openId, setOpenId] = useState(null);
  const open = data.rows.find((m) => m._id === openId);
  const counts = data.counts || {};

  // Updates one row in place (and the status counts) without refetching the list
  const applyStatus = (updated, from) => {
    setData((d) => ({
      ...d,
      rows: d.rows.map((m) => (m._id === updated._id ? updated : m)),
      counts: { ...d.counts, [from]: (d.counts[from] || 1) - 1, [updated.status]: (d.counts[updated.status] || 0) + 1 },
    }));
  };

  const setStatus = async (message, status) => {
    if (message.status === status) return;
    const res = await run(() => apiSecure.patch(`/contact/${message._id}`, { status }));
    if (res) applyStatus(res.data.data, message.status);
  };

  const view = (message) => {
    setOpenId(message._id);
    if (message.status === 'unread') setStatus(message, 'read');
  };

  const remove = async (message) => {
    if (await run(() => apiSecure.delete(`/contact/${message._id}`))) {
      setOpenId(null);
      reload();
    }
  };

  const columns = [
    {
      key: 'fullName',
      header: 'From',
      render: (m) => (
        <div className="min-w-0">
          <p className={cn('truncate text-ink', m.status === 'unread' ? 'font-bold' : 'font-medium')}>{m.fullName}</p>
          <p className="truncate text-xs text-subtle">{m.email}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Message',
      render: (m) => (
        <div className="min-w-0 max-w-xl">
          <p className={cn('truncate', m.status === 'unread' ? 'font-semibold text-ink' : 'text-body')}>{m.subject || '(no subject)'}</p>
          <p className="truncate text-xs text-subtle">{m.message}</p>
        </div>
      ),
    },
    { key: 'status', header: 'Status', render: (m) => <Badge color={STATUS_COLORS[m.status]}>{m.status}</Badge> },
    { key: 'createdAt', header: 'Received', className: 'whitespace-nowrap', render: (m) => formatDate(m.createdAt, true) },
  ];

  return (
    <>
      <PageTitle title="Messages" description="Requests sent from the Contact page and product quotation forms." />
      <StatGrid>
        <StatCard label="All messages" value={(counts.unread || 0) + (counts.read || 0) + (counts.replied || 0)} icon={FaInbox} loading={loading && !data.total} />
        <StatCard label="Unread" value={counts.unread} icon={FaEnvelope} tone="amber" loading={loading && !data.total} />
        <StatCard label="Read" value={counts.read} icon={FaEnvelopeOpen} loading={loading && !data.total} />
        <StatCard label="Replied" value={counts.replied} icon={FaReply} tone="green" loading={loading && !data.total} />
      </StatGrid>
      <Alert type="error" className="mb-4">{error || actionError}</Alert>
      {open && <MessageDetail message={open} busy={busy} onStatus={(s) => setStatus(open, s)} onDelete={() => remove(open)} onClose={() => setOpenId(null)} />}
      <Card className="p-0">
        <FilterBar
          search={search}
          onSearch={setSearch}
          placeholder="Search name, email, phone or message…"
          filters={[{ key: 'status', value: filters.status, onChange: set('status'), options: STATUS_OPTIONS }]}
        />
        <DataTable
          columns={columns}
          rows={data.rows}
          loading={loading}
          onRowClick={view}
          emptyTitle="No messages"
          emptyDescription={query ? 'Try another search or filter.' : 'Messages sent from the Contact page appear here.'}
        />
        <Pagination page={page} pageCount={data.pageCount} onChange={setPage} />
      </Card>
    </>
  );
}
