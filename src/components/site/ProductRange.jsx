import Link from 'next/link';
import { CategoryIcon, childrenOf } from '@/data/product-categories';
import { cn } from '@/lib/utils';

const href = (slug) => `/products?category=${slug}#catalog`;

// The whole category tree as a directory (Products page): groups → categories → › sub-categories.
// listed = slugs that have at least one product (marked with a dot).
export default function ProductRange({ categories, listed }) {
  const groups = childrenOf(categories);
  return (
    <div className="columns-1 gap-10 sm:columns-2 lg:columns-4">
      {groups.map((g) => {
        return (
          <section key={g.slug} className="mb-10 break-inside-avoid">
            <Link href={href(g.slug)} className="group flex items-start gap-2.5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-700 to-cyan-500 text-sm text-white">
                <CategoryIcon name={g.icon} />
              </span>
              <h3 className="text-sm font-extrabold uppercase leading-snug tracking-wide text-ink group-hover:text-sky-700 dark:group-hover:text-cyan-300">{g.name}</h3>
            </Link>
            <ul className="mt-3 space-y-0.5">
              {childrenOf(categories, g.slug).map((c) => {
                const subs = childrenOf(categories, c.slug);
                return (
                  <li key={c.slug}>
                    <Link href={href(c.slug)} className={cn('flex items-center gap-2 rounded-md py-1.5 text-sm transition-colors hover:text-sky-700 dark:hover:text-cyan-300', subs.length ? 'font-semibold text-ink-2' : 'text-muted')}>
                      {c.name}
                      {listed.has(c.slug) && <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" title="Products listed" />}
                    </Link>
                    {subs.length > 0 && (
                      <ul className="mb-1 border-l border-line/10 pl-3">
                        {subs.map((s) => (
                          <li key={s.slug}>
                            <Link href={href(s.slug)} className="flex items-center gap-2 py-1 text-sm text-muted transition-colors hover:text-sky-700 dark:hover:text-cyan-300">
                              <span className="text-cyan-500" aria-hidden>›</span> {s.name}
                              {listed.has(s.slug) && <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" title="Products listed" />}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
