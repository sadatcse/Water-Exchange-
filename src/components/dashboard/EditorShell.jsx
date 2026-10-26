'use client';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import PageTitle from '@/components/dashboard/PageTitle';
import { FormSkeleton } from '@/components/loading/PageSkeletons';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';

/**
 * Create / edit form layout used by the product, blog and team editors:
 * back link + title, error/success messages, the form sections, and a sticky save bar.
 */
export default function EditorShell({ title, description, backHref, backLabel, loading, loadError, error, success, busy, isNew, onSubmit, children }) {
  return (
    <>
      <Link href={backHref} className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink">
        <FaArrowLeft aria-hidden /> {backLabel}
      </Link>
      <PageTitle title={title} description={description} />
      {loading ? (
        <FormSkeleton cards={3} />
      ) : loadError ? (
        <Alert type="error">{loadError}</Alert>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-6 pb-24"
        >
          {children}
          <div className="sticky bottom-0 z-20 -mx-4 flex flex-col gap-3 border-t border-line/10 bg-surface/95 px-4 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-end md:-mx-8 md:px-8">
            <div className="min-w-0 flex-1" aria-live="polite">
              <Alert type="error">{error}</Alert>
              <Alert type="success">{success}</Alert>
            </div>
            <div className="flex gap-2">
              <Button href={backHref} variant="secondary">Cancel</Button>
              <Button type="submit" disabled={busy}>
                <FaSave aria-hidden /> {busy ? 'Saving…' : isNew ? 'Create' : 'Save changes'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
