import Link from 'next/link';
import { cn } from '@/lib/utils';

const VARIANTS = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary: 'border border-line/20 bg-surface text-body hover:bg-line/5',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'text-muted hover:bg-line/10',
  // Brand gradient (public pages)
  brand: 'bg-gradient-to-r from-sky-700 to-cyan-500 text-white shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/30',
  // On dark (abyss) backgrounds
  white: 'bg-white text-sky-800 shadow-lg hover:-translate-y-0.5 hover:bg-sky-50',
  glass: 'border border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

// <Button href="/contact">…</Button> renders a link; without href it's a <button>.
export default function Button({ href, variant = 'primary', size = 'md', className, children, ...props }) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60',
    VARIANTS[variant],
    SIZES[size],
    className
  );
  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
