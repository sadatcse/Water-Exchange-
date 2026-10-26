'use client';
import { FaImages } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import useFilters from '@/hooks/useFilters';
import useServerPage from '@/hooks/useServerPage';
import Modal from '@/components/modals/Modal';
import MediaGrid from '@/components/dashboard/MediaGrid';
import Pagination from '@/components/dashboard/Pagination';
import { TableRowsSkeleton } from '@/components/loading/PageSkeletons';
import EmptyState from '@/components/ui/EmptyState';
import Alert from '@/components/ui/Alert';

const PER_PAGE = 20;

// Loaded only while open
function Library({ selectedUrl, onSelect }) {
  const { search, setSearch, query } = useFilters({ search: '' });
  const { page, setPage } = useServerPage(query);
  const { data, loading, error } = useApi(`/media?${query}&page=${page}&limit=${PER_PAGE}`, { initialData: { rows: [], pageCount: 1 }, select: (res) => res.data });

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        // The modal can sit inside an editor's <form> — Enter here must not submit it
        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        placeholder="Search by file name…"
        aria-label="Search images"
        className="w-full rounded-lg border border-line/20 bg-surface px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
      />
      <Alert type="error">{error}</Alert>
      {loading ? (
        <TableRowsSkeleton rows={4} cols={4} />
      ) : data.rows.length ? (
        <MediaGrid rows={data.rows} onSelect={onSelect} selectedUrl={selectedUrl} />
      ) : (
        <EmptyState icon={FaImages} title={query ? 'No images match' : 'No uploads yet'} description="Images you upload from any form appear here." />
      )}
      <Pagination page={page} pageCount={data.pageCount} onChange={setPage} />
    </div>
  );
}

// Pick a previously uploaded image. onSelect(media) receives { url, width, height, … }.
export default function MediaLibraryModal({ open, onClose, onSelect, selectedUrl }) {
  return (
    <Modal open={open} onClose={onClose} title="Media library" description="Click an image to use it." size="lg">
      {open && (
        <Library
          selectedUrl={selectedUrl}
          onSelect={(media) => {
            onSelect(media);
            onClose();
          }}
        />
      )}
    </Modal>
  );
}
