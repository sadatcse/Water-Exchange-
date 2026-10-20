import { FaPlus } from 'react-icons/fa';
import Reveal from './Reveal';

// Accordion built on <details> — works without JavaScript
export default function Faq({ items, openFirst = true }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <Reveal key={item.q} delay={i * 60}>
          <details
            className="group rounded-2xl border border-line/10 bg-surface px-5 py-4 transition-colors open:border-cyan-500/40 open:shadow-lg open:shadow-cyan-500/5 md:px-6"
            open={openFirst && i === 0}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {item.q}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-sky-700 transition-transform duration-300 group-open:rotate-45 dark:text-cyan-300">
                <FaPlus size={12} aria-hidden />
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-muted">{item.a}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
