import { cn } from '@/lib/utils';
import Reveal from './Reveal';

// Eyebrow + title (with gradient accent) + optional subtitle. onDark: light text for abyss sections.
export default function SectionHeading({ eyebrow, title, accent, subtitle, align = 'center', onDark = false, className }) {
  const centered = align === 'center';
  return (
    <Reveal className={cn(centered && 'mx-auto text-center', 'max-w-3xl', className)}>
      {eyebrow && (
        <p
          className={cn(
            'inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]',
            onDark ? 'text-cyan-300' : 'text-sky-700 dark:text-cyan-300'
          )}
        >
          <span className="h-px w-6 bg-current" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2 className={cn('mt-3 text-3xl font-extrabold md:text-4xl', onDark && 'text-white')}>
        {title} {accent && <span className={onDark ? 'text-cyan-300' : 'text-brand'}>{accent}</span>}
      </h2>
      {subtitle && <p className={cn('mt-4 text-base leading-relaxed md:text-lg', onDark ? 'text-sky-100/80' : 'text-muted')}>{subtitle}</p>}
    </Reveal>
  );
}
