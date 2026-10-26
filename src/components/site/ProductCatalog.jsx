'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaThList, FaFileInvoice } from 'react-icons/fa';
import { CategoryIcon, childrenOf, descendantSlugs, pathTo } from '@/data/product-categories';
import { cn } from '@/lib/utils';
import Reveal from './Reveal';
import ProductCard from './ProductCard';

const pill = (on, size = 'md') =>
  cn(
    'inline-flex items-center gap-2 whitespace-nowrap rounded-full border font-semibold transition-all duration-200',
    size === 'md' ? 'px-4 py-2.5 text-sm' : 'px-3 py-1.5 text-xs',
    on ? 'border-transparent bg-gradient-to-r from-sky-700 to-cyan-500 text-white shadow-lg shadow-cyan-500/25' : 'border-line/15 bg-surface text-muted hover:border-cyan-500/50 hover:text-ink'
  );

const count = (n) => <span className="rounded-full bg-line/5 px-2 py-0.5 text-[11px] font-bold opacity-80">{n}</span>;

function ChipRow({ label, items, active, onChoose, countFor }) {
  if (!items.length) return null;
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-center" role="group" aria-label={label}>
        {items.map((c) => (
          <button key={c.slug} type="button" aria-pressed={active === c.slug} onClick={() => onChoose(c.slug)} className={pill(active === c.slug, 'sm')}>
            {c.name} {count(countFor(c.slug))}
          </button>
        ))}
      </div>
    </div>
  );
}

// Category filter (group tabs → category chips → sub-category chips) + product grid.
// The choice is kept in ?category= so a filtered view can be shared; the page keys this component by
// ?category=, so links to another category (Full product range) start it fresh.
// products: published products (card fields + categoryInfo) · categories: the flat category list
export default function ProductCatalog({ products, categories, initialCategory = 'all' }) {
  const [active, setActive] = useState(initialCategory);
  const countFor = (slug) => {
    const slugs = new Set(descendantSlugs(categories, slug));
    return products.filter((p) => slugs.has(p.category)).length;
  };
  // Categories with products — plus the selected one, so an empty category still shows as chosen
  const withProducts = (list, keep) => list.filter((c) => countFor(c.slug) > 0 || c.slug === keep);

  const path = active === 'all' ? [] : pathTo(categories, active);
  const current = path[path.length - 1];
  const group = path[0];
  const level1 = path[1];
  const inActive = current ? new Set(descendantSlugs(categories, current.slug)) : null;
  const shown = inActive ? products.filter((p) => inActive.has(p.category)) : products;

  const choose = (slug) => {
    setActive(slug);
    const url = new URL(window.location.href);
    if (slug === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', slug);
    window.history.replaceState(null, '', url);
  };

  const groups = withProducts(childrenOf(categories));
  // Keep the current group visible even when it has no products yet
  if (group && !groups.some((g) => g.slug === group.slug)) groups.push(group);

  return (
    <>
      <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-center" role="group" aria-label="Filter by product group">
          <button type="button" aria-pressed={!current} onClick={() => choose('all')} className={pill(!current)}>
            <FaThList className={!current ? 'text-white' : 'text-cyan-500'} aria-hidden /> All products {count(products.length)}
          </button>
          {groups.map((g) => {
            const on = group?.slug === g.slug;
            return (
              <button key={g.slug} type="button" aria-pressed={on} onClick={() => choose(g.slug)} className={pill(on)}>
                <CategoryIcon name={g.icon} className={on ? 'text-white' : 'text-cyan-500'} /> {g.name} {count(countFor(g.slug))}
              </button>
            );
          })}
        </div>
      </div>

      {group && (
        <div className="mt-4 space-y-2">
          <ChipRow label={`${group.name} categories`} items={withProducts(childrenOf(categories, group.slug), level1?.slug)} active={level1?.slug} onChoose={choose} countFor={countFor} />
          {level1 && <ChipRow label={`${level1.name} types`} items={withProducts(childrenOf(categories, level1.slug), path[2]?.slug)} active={path[2]?.slug} onChoose={choose} countFor={countFor} />}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-subtle" aria-live="polite">
        {!current
          ? `Showing all ${shown.length} products`
          : `${shown.length} ${shown.length === 1 ? 'product' : 'products'} in ${path.map((c) => c.name).join(' › ')}${group.description && current === group ? ` · ${group.description}` : ''}`}
      </p>

      {shown.length ? (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((product, i) => (
            <Reveal as="li" key={product.slug} delay={(i % 3) * 100}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </ul>
      ) : (
        <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-dashed border-cyan-500/30 bg-cyan-500/5 p-8 text-center">
          <p className="text-lg font-bold text-ink">We supply {current?.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">This range isn’t listed online yet. Tell us your requirement and our engineers will send the right model with a quotation.</p>
          <Link
            href="/contact#contact-form"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-700 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/25"
          >
            <FaFileInvoice aria-hidden /> Request a quotation
          </Link>
        </div>
      )}
    </>
  );
}
