import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { listPublishedPosts } from '@/server/services/blog.service';
import { num } from '@/server/validate';
import DarkPageHeader from '@/components/ui/DarkPageHeader';
import Container from '@/components/ui/Container';
import EmptyState from '@/components/ui/EmptyState';
import Reveal from '@/components/site/Reveal';
import BlogCard from '@/components/site/BlogCard';
import CtaBand from '@/components/site/CtaBand';
import { cn } from '@/lib/utils';
import { pageMetadata } from '@/lib/seo';

export const generateMetadata = () =>
  pageMetadata({
    title: 'Blog',
    description: `Guides, research and field notes from ${siteConfig.name} — ETP, STP and WTP, DOE clearance, water testing and waste management in Bangladesh.`,
    path: '/blog',
  });

const PER_PAGE = 9;

// /blog?category=&page= — keeps the other parameter when one changes
const href = ({ category, page }) => {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `/blog?${qs}` : '/blog';
};

const chip = (on) =>
  cn(
    'inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all',
    on ? 'border-transparent bg-gradient-to-r from-sky-700 to-cyan-500 text-white shadow-lg shadow-cyan-500/25' : 'border-line/15 bg-surface text-muted hover:border-cyan-500/50 hover:text-ink'
  );

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const category = typeof params.category === 'string' ? params.category : '';
  const page = Math.max(1, Math.floor(num(params.page, 1)));
  const { posts, total, pageCount, categories } = await listPublishedPosts({ category, page, limit: PER_PAGE });
  const active = categories.some((c) => c.name === category) ? category : '';
  const allCount = categories.reduce((sum, c) => sum + c.count, 0);
  // The newest post gets the large card on the first, unfiltered page
  const [featured, ...rest] = !active && page === 1 ? posts : [null, ...posts];

  return (
    <div className="bg-canvas">
      <DarkPageHeader title="Insights &" accent="Field Notes" subtitle="Practical guides on treatment plants, DOE compliance and waste — plus research from our field work." breadcrumbs={[{ label: 'Blog' }]} />

      <section className="py-16 md:py-20">
        <Container className="max-w-7xl">
          <nav aria-label="Blog categories" className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <ul className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-center">
              <li>
                <Link href="/blog" className={chip(!active)} aria-current={!active ? 'page' : undefined}>
                  All posts <span className="text-[11px] opacity-80">{allCount}</span>
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.name}>
                  <Link href={href({ category: c.name })} className={chip(active === c.name)} aria-current={active === c.name ? 'page' : undefined}>
                    {c.name} <span className="text-[11px] opacity-80">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {!posts.length ? (
            <div className="mt-12">
              <EmptyState title="No posts yet" description="New articles will appear here soon." />
            </div>
          ) : (
            <>
              {featured && (
                <Reveal className="mt-10">
                  <BlogCard post={featured} large />
                </Reveal>
              )}
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post, i) => (
                  <Reveal as="li" key={post.slug} delay={(i % 3) * 100}>
                    <BlogCard post={post} />
                  </Reveal>
                ))}
              </ul>
            </>
          )}

          {pageCount > 1 && (
            <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link href={href({ category: active, page: page - 1 })} className={chip(false)} aria-label="Previous page">
                  <FaChevronLeft aria-hidden />
                </Link>
              )}
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={href({ category: active, page: n })} className={cn(chip(n === page), 'min-w-[2.75rem] justify-center')} aria-current={n === page ? 'page' : undefined}>
                  {n}
                </Link>
              ))}
              {page < pageCount && (
                <Link href={href({ category: active, page: page + 1 })} className={chip(false)} aria-label="Next page">
                  <FaChevronRight aria-hidden />
                </Link>
              )}
            </nav>
          )}
          <p className="mt-6 text-center text-sm text-subtle">
            {total} {total === 1 ? 'article' : 'articles'}
            {active && ` in ${active}`}
          </p>
        </Container>
      </section>

      <CtaBand />
    </div>
  );
}
