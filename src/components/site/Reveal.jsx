'use client';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// Fades + slides its content in when it scrolls into view (once). delay in ms staggers siblings.
export default function Reveal({ as: Tag = 'div', delay = 0, className, style, children, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.disconnect();
          // Drop the stagger once the entrance is done so hover transitions aren't delayed
          timer = setTimeout(() => el.style.setProperty('--reveal-delay', '0ms'), delay + 800);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    );
    let timer;
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <Tag ref={ref} className={cn('reveal', className)} style={{ ...style, '--reveal-delay': `${delay}ms` }} {...props}>
      {children}
    </Tag>
  );
}
