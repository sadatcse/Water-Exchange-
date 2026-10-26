import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaRegClock } from 'react-icons/fa';
import { imageProps } from '@/lib/images';
import { formatDate, cn } from '@/lib/utils';

// Blog post card (home, /blog, related posts). `large` = the featured post on /blog.
export default function BlogCard({ post, large = false, className }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group flex h-full overflow-hidden rounded-3xl border border-line/10 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-sky-900/10',
        large ? 'flex-col md:grid md:grid-cols-2' : 'flex-col',
        className
      )}
    >
      <div className={cn('relative overflow-hidden bg-sky-900', large ? 'aspect-[16/10] md:aspect-auto md:min-h-[22rem]' : 'aspect-[16/10]')}>
        <Image
          src={post.coverImage}
          alt=""
          {...imageProps(post.coverImage)}
          fill
          sizes={large ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-abyss/80 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          {large ? `Featured · ${post.category}` : post.category}
        </span>
      </div>
      <div className={cn('flex flex-1 flex-col', large ? 'p-7 md:p-10' : 'p-6')}>
        <p className="flex items-center gap-2 text-xs font-medium text-subtle">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <FaRegClock aria-hidden /> {post.readMinutes} min read
        </p>
        <h3 className={cn('mt-2 leading-snug transition-colors group-hover:text-sky-700 dark:group-hover:text-cyan-300', large ? 'text-2xl font-extrabold md:text-3xl' : 'text-lg')}>
          {post.title}
        </h3>
        <p className={cn('mt-3 leading-relaxed text-muted', large ? 'line-clamp-4' : 'line-clamp-3 text-sm')}>{post.excerpt}</p>
        <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-sky-700 dark:text-cyan-300">
          Read article <FaArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
