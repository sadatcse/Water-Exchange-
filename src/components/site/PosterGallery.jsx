'use client';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaTimes, FaExpand } from 'react-icons/fa';
import Reveal from './Reveal';

// Grid of campaign posters with a lightbox (Esc / ← → / swipe-free buttons). items: [{ src, title, tag }]
export default function PosterGallery({ items }) {
  const [open, setOpen] = useState(null); // index or null
  const count = items.length;
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d) => setOpen((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, close, step]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {items.map((item, i) => (
          <Reveal as="li" key={item.src} delay={(i % 3) * 100}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-line/10 bg-surface text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 md:rounded-3xl"
              aria-label={`Open: ${item.title}`}
            >
              <Image
                src={item.src}
                alt={item.title}
                width={540}
                height={540}
                sizes="(min-width: 768px) 33vw, 50vw"
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-abyss/90 via-abyss/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:p-5">
                <span className="w-fit rounded-full bg-cyan-400/90 px-2.5 py-0.5 text-[11px] font-bold text-abyss">{item.tag}</span>
                <span className="mt-2 text-sm font-semibold leading-snug text-white">{item.title}</span>
              </span>
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-sky-800 opacity-0 shadow transition-opacity group-hover:opacity-100" aria-hidden>
                <FaExpand size={12} />
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      {open !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/95 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={items[open].title} onClick={close}>
          <figure className="relative w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <Image src={items[open].src} alt={items[open].title} width={1080} height={1080} className="max-h-[78vh] w-full rounded-2xl object-contain shadow-2xl" priority />
            <figcaption className="mt-4 text-center text-sm text-sky-100">
              <span className="mr-2 rounded-full bg-cyan-400/90 px-2.5 py-0.5 text-[11px] font-bold text-abyss">{items[open].tag}</span>
              {items[open].title}
            </figcaption>
          </figure>
          <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
            <FaTimes aria-hidden />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous" className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:left-8">
            <FaChevronLeft aria-hidden />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next" className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-8">
            <FaChevronRight aria-hidden />
          </button>
        </div>
      )}
    </>
  );
}
