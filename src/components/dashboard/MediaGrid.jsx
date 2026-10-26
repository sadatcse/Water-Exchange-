'use client';
import { FaCheck, FaCopy, FaTrashAlt } from 'react-icons/fa';
import { cn } from '@/lib/utils';

export const formatBytes = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

/**
 * Thumbnails of uploaded images.
 *   onSelect(media)  → picking mode (media library modal)
 *   onDelete(media) / onCopy(media) → management mode (Dashboard → Media)
 */
export default function MediaGrid({ rows, onSelect, selectedUrl, onDelete, onCopy, copiedId, deleting }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {rows.map((m) => {
        const selected = selectedUrl === m.url;
        return (
          <li key={m._id} className={cn('group overflow-hidden rounded-xl border bg-surface transition-shadow hover:shadow-lg', selected ? 'border-primary-500 ring-2 ring-primary-500' : 'border-line/10')}>
            <button
              type="button"
              onClick={onSelect ? () => onSelect(m) : undefined}
              className={cn('relative block aspect-[4/3] w-full overflow-hidden bg-[repeating-conic-gradient(#e2e8f0_0_25%,#f8fafc_0_50%)] bg-[length:16px_16px]', !onSelect && 'cursor-default')}
              aria-label={onSelect ? `Use ${m.name || 'this image'}` : m.name}
              tabIndex={onSelect ? 0 : -1}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt="" loading="lazy" className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
              {selected && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs text-white">
                  <FaCheck aria-hidden />
                </span>
              )}
            </button>
            <div className="flex items-center gap-1 px-2.5 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-ink" title={m.name}>{m.name || 'image'}</p>
                <p className="text-[11px] text-subtle">
                  {m.width ? `${m.width}×${m.height} · ` : ''}
                  {formatBytes(m.size)}
                </p>
              </div>
              {onCopy && (
                <button type="button" onClick={() => onCopy(m)} className="rounded p-1.5 text-subtle hover:bg-line/10 hover:text-ink" aria-label="Copy image link" title="Copy link">
                  {copiedId === m._id ? <FaCheck className="text-green-600" aria-hidden /> : <FaCopy aria-hidden />}
                </button>
              )}
              {onDelete && (
                <button type="button" onClick={() => onDelete(m)} disabled={deleting} className="rounded p-1.5 text-subtle hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-500/10" aria-label="Delete image" title="Delete">
                  <FaTrashAlt className="text-xs" aria-hidden />
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
