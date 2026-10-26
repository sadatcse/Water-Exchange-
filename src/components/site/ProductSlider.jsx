'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { imageProps } from '@/lib/images';
import { cn } from '@/lib/utils';

const AUTOPLAY_MS = 4500;
const arrow =
  'absolute top-[42%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line/10 bg-surface text-ink shadow-lg transition hover:bg-sky-600 hover:text-white disabled:pointer-events-none disabled:opacity-0 sm:flex';

// Home page product row: simple white cards (photo + name), 4 per view on desktop, with arrows, dots and autoplay.
// products: published products from the server
export default function ProductSlider({ products }) {
  const track = useRef(null);
  const [pos, setPos] = useState({ index: 0, pages: 1, atStart: true, atEnd: false });
  const [paused, setPaused] = useState(false);

  // Width of one card plus the gap
  const step = () => {
    const el = track.current;
    const card = el?.firstElementChild;
    if (!card) return 1;
    return card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || 0);
  };

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const s = step();
    const max = el.scrollWidth - el.clientWidth;
    setPos({
      index: Math.round(el.scrollLeft / s),
      pages: Math.max(1, products.length - Math.round(el.clientWidth / s) + 1),
      atStart: el.scrollLeft < 4,
      atEnd: el.scrollLeft > max - 4,
    });
  }, [products.length]);

  const goTo = (i) => track.current?.scrollTo({ left: i * step(), behavior: 'smooth' });
  const move = (dir) => {
    const el = track.current;
    if (!el) return;
    // Wrap around at either end
    if (dir > 0 && pos.atEnd) goTo(0);
    else if (dir < 0 && pos.atStart) goTo(pos.pages - 1);
    else el.scrollBy({ left: dir * step(), behavior: 'smooth' });
  };

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  // Autoplay — off while hovered/focused, when the tab is hidden, or when the user prefers less motion
  const moveRef = useRef(move);
  useEffect(() => {
    moveRef.current = move;
  });
  useEffect(() => {
    if (paused || pos.pages <= 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => !document.hidden && moveRef.current(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, pos.pages]);

  if (!products.length) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <button type="button" onClick={() => move(-1)} aria-label="Previous products" className={cn(arrow, '-left-3 lg:-left-5')}>
        <FaChevronLeft aria-hidden />
      </button>
      <button type="button" onClick={() => move(1)} aria-label="Next products" className={cn(arrow, '-right-3 lg:-right-5')}>
        <FaChevronRight aria-hidden />
      </button>

      <ul
        ref={track}
        onScroll={update}
        aria-label="Products"
        className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((p) => (
          <li key={p.slug} className="w-[72%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] md:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]">
            <Link
              href={`/products/${p.slug}`}
              className="group block h-full overflow-hidden rounded-md border border-line/10 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-900/10"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-white">
                <Image
                  src={p.image}
                  alt={p.name}
                  {...imageProps(p.image)}
                  fill
                  sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 72vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="border-t border-line/10 px-4 py-3.5 text-center text-[15px] font-bold text-ink transition-colors group-hover:text-sky-700 dark:group-hover:text-cyan-300">
                {p.name}
              </h3>
            </Link>
          </li>
        ))}
      </ul>

      {pos.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: pos.pages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === pos.index}
              className={cn('h-2 rounded-full transition-all', i === pos.index ? 'w-6 bg-sky-600' : 'w-2 bg-line/20 hover:bg-line/40')}
            />
          ))}
        </div>
      )}
    </div>
  );
}
