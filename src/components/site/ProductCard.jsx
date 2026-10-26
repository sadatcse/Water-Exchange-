import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';
import { CategoryIcon } from '@/data/product-categories';
import { imageProps } from '@/lib/images';
import { cn } from '@/lib/utils';

// Catalogue card: full-bleed 4:3 product photo, two key figures, link to its page
export default function ProductCard({ product, className }) {
  const label = product.categoryInfo?.name;
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line/10 bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10',
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#eceef0]">
        <Image
          src={product.image}
          alt={product.name}
          {...imageProps(product.image)}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 85vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {label && (
          <span className="absolute left-4 top-4 inline-flex max-w-[65%] items-center gap-1.5 rounded-full bg-abyss/85 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
            <CategoryIcon name={product.categoryInfo.icon} className="shrink-0 text-cyan-300" /> <span className="truncate">{label}</span>
          </span>
        )}
        {product.origin && (
          <span className="absolute right-4 top-4 rounded-full border border-sky-900/10 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-sky-800">
            {product.origin}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="truncate text-xs font-bold uppercase tracking-[0.15em] text-sky-700 dark:text-cyan-300">{product.brand}</p>
        <h3 className="mt-1.5 text-lg leading-snug">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{product.summary}</p>
        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line/10 pt-4">
          {product.highlights.slice(0, 2).map((h) => (
            <div key={h.label} className="min-w-0">
              <dt className="truncate text-[11px] font-semibold uppercase tracking-wider text-subtle">{h.label}</dt>
              <dd className="mt-0.5 text-sm font-bold text-ink">{h.value}</dd>
            </div>
          ))}
        </dl>
        <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-sky-700 dark:text-cyan-300">
          View details <FaArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-sky-700 to-cyan-500 transition-transform duration-500 group-hover:scale-x-100" aria-hidden />
    </Link>
  );
}
