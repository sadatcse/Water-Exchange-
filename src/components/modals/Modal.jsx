'use client';
import { useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';
import { cn } from '@/lib/utils';

/**
 * Base modal on the native <dialog> (focus is kept inside, Esc closes, the page behind is inert).
 *   <Modal open={open} onClose={() => setOpen(false)} title="Media library" size="lg">…</Modal>
 */
export default function Modal({ open, onClose, title, description, size = 'md', children, footer }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // A click on the backdrop (the dialog element itself, outside the panel) closes it
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="modal-title"
      className={cn(
        'm-auto w-[calc(100%-2rem)] rounded-2xl border border-line/10 bg-surface p-0 text-body shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm',
        { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-5xl' }[size]
      )}
    >
      {open && (
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-line/10 px-5 py-4">
            <div>
              <h2 id="modal-title" className="text-lg">{title}</h2>
              {description && <p className="mt-0.5 text-sm text-subtle">{description}</p>}
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-subtle hover:bg-line/10 hover:text-ink" aria-label="Close">
              <HiX size={20} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
          {footer && <div className="flex justify-end gap-2 border-t border-line/10 px-5 py-3">{footer}</div>}
        </div>
      )}
    </dialog>
  );
}
