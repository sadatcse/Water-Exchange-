'use client';
import { useRef, useState } from 'react';
import { FaCloudUploadAlt, FaImages } from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import useFilters from '@/hooks/useFilters';
import useServerPage from '@/hooks/useServerPage';
import useSubmit from '@/hooks/useSubmit';
import useImageUpload from '@/hooks/useImageUpload';
import { apiSecure } from '@/lib/api-client';
import PageTitle from '@/components/dashboard/PageTitle';
import MediaGrid, { formatBytes } from '@/components/dashboard/MediaGrid';
import Pagination from '@/components/dashboard/Pagination';
import { TableRowsSkeleton } from '@/components/loading/PageSkeletons';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import EmptyState from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

const PER_PAGE = 30;

export default function MediaAdmin() {
  const inputRef = useRef(null);
  const { search, setSearch, query } = useFilters({ search: '' });
  const { page, setPage } = useServerPage(query);
  const { data, loading, error, reload } = useApi(`/media?${query}&page=${page}&limit=${PER_PAGE}`, { initialData: { rows: [], total: 0, pageCount: 1 }, select: (res) => res.data });
  const { upload, uploading, progress, error: uploadError } = useImageUpload();
  const del = useSubmit();
  const [queue, setQueue] = useState({ done: 0, total: 0 });
  const [dragging, setDragging] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [notice, setNotice] = useState('');

  // Uploads one after another (keeps shared hosting happy and the progress readable)
  const uploadAll = async (files) => {
    const images = [...files].filter((f) => f.type.startsWith('image/'));
    if (!images.length) return;
    setNotice('');
    let ok = 0;
    for (let i = 0; i < images.length; i++) {
      setQueue({ done: i, total: images.length });
      if (await upload(images[i])) ok += 1;
    }
    setQueue({ done: 0, total: 0 });
    setNotice(`${ok} of ${images.length} image${images.length === 1 ? '' : 's'} uploaded.`);
    setPage(1);
    reload();
  };

  const copy = async (m) => {
    try {
      await navigator.clipboard.writeText(m.url);
      setCopiedId(m._id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      window.prompt('Copy the image link:', m.url);
    }
  };

  const remove = async (m) => {
    if (!window.confirm(`Delete “${m.name || 'this image'}”? It is removed from the server.`)) return;
    setNotice('');
    del.setError('');
    try {
      await apiSecure.delete(`/media/${m._id}`);
    } catch (err) {
      // Still used somewhere — ask before deleting anyway
      if (err.response?.status !== 409 || !window.confirm(`${err.response.data.message}\n\nDelete anyway? Those places will show no image.`)) {
        if (err.response?.status !== 409) del.setError(err.response?.data?.message || 'Could not delete the image.');
        return;
      }
      if (!(await del.run(() => apiSecure.delete(`/media/${m._id}?force=1`)))) return;
    }
    setNotice('Image deleted.');
    reload();
  };

  const busyLabel = queue.total > 1 ? `Uploading ${queue.done + 1} of ${queue.total}… ${progress}%` : `Uploading… ${progress}%`;

  return (
    <>
      <PageTitle title="Media library" description={`${data.total} uploaded image${data.total === 1 ? '' : 's'} — stored on the website server and usable in any image field.`} />

      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          uploadAll(e.dataTransfer.files);
        }}
        className={cn(
          'mb-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-line/20 bg-surface hover:border-primary-400'
        )}
      >
        <FaCloudUploadAlt className={cn('text-4xl', dragging ? 'text-primary-500' : 'text-faint')} aria-hidden />
        <p className="font-semibold text-ink">{uploading ? busyLabel : 'Drop images here, or click to choose'}</p>
        <p className="text-xs text-subtle">JPG, PNG, WebP or GIF · several at once · large photos are resized to 1920 px and compressed to WebP before uploading</p>
        {uploading && (
          <span className="mt-2 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-line/10">
            <span className="block h-full bg-primary-500 transition-[width]" style={{ width: `${progress}%` }} />
          </span>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            uploadAll(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      <Alert type="error" className="mb-4">{error || uploadError || del.error}</Alert>
      <Alert type="success" className="mb-4">{notice}</Alert>

      <Card className="p-0">
        <div className="flex flex-col gap-3 border-b border-line/10 p-4 sm:flex-row sm:items-center">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file name…"
            aria-label="Search images"
            className="w-full rounded-lg border border-line/20 bg-surface px-3 py-2 text-sm focus:border-primary-500 focus:outline-none sm:max-w-sm"
          />
          {data.rows.length > 0 && (
            <p className="text-xs text-subtle sm:ml-auto">
              This page: {formatBytes(data.rows.reduce((sum, m) => sum + m.size, 0))}
            </p>
          )}
        </div>
        <div className="p-4">
          {loading ? (
            <TableRowsSkeleton rows={4} cols={5} />
          ) : data.rows.length ? (
            <MediaGrid rows={data.rows} onCopy={copy} copiedId={copiedId} onDelete={remove} deleting={del.busy} />
          ) : (
            <EmptyState icon={FaImages} title={query ? 'No images match' : 'No uploads yet'} description="Upload images here or from any image field in the dashboard." />
          )}
        </div>
        <Pagination page={page} pageCount={data.pageCount} onChange={setPage} />
      </Card>
    </>
  );
}
