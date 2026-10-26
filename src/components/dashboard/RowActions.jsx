'use client';
import Link from 'next/link';
import { FaEdit, FaTrashAlt, FaExternalLinkAlt } from 'react-icons/fa';

const btn = 'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line/10 text-muted transition-colors';

// Edit / view / delete buttons for a content row. Clicks don't bubble to the row.
export default function RowActions({ editHref, viewHref, onDelete, deleting, label = 'item' }) {
  return (
    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      {viewHref && (
        <a href={viewHref} target="_blank" rel="noopener noreferrer" className={`${btn} hover:bg-line/5 hover:text-ink`} aria-label={`View ${label} on the website`}>
          <FaExternalLinkAlt className="text-xs" aria-hidden />
        </a>
      )}
      <Link href={editHref} className={`${btn} hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-500/15`} aria-label={`Edit ${label}`}>
        <FaEdit aria-hidden />
      </Link>
      <button
        type="button"
        onClick={() => window.confirm(`Delete this ${label}? This cannot be undone.`) && onDelete()}
        disabled={deleting}
        className={`${btn} hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-500/10`}
        aria-label={`Delete ${label}`}
      >
        <FaTrashAlt className="text-xs" aria-hidden />
      </button>
    </div>
  );
}
