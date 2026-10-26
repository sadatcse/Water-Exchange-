import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

// Brand logo from public/brand. variant: 'auto' (follows light/dark theme) | 'light' (always the light version, for dark backgrounds).
// fx: glint + hover lift (navbar) — styles in globals.css (.logo-fx)
export default function Logo({ className = '', variant = 'auto', height = 56, fx = false }) {
  const width = Math.round((height * 319) / 237);
  const img = (src, extra) => (
    <Image src={src} alt={siteConfig.name} width={width} height={height} loading="eager" fetchPriority="high" unoptimized className={cn('h-full w-auto', extra)} />
  );
  return (
    <Link href="/" className={cn('flex shrink-0 items-center', fx && 'logo-fx', className)} style={{ height }} aria-label={`${siteConfig.name} — home`}>
      <span className="logo-img flex h-full">
        {variant === 'light' ? (
          img('/brand/wx-light.svg')
        ) : (
          <>
            {img('/brand/wx-primary.svg', 'dark:hidden')}
            {img('/brand/wx-light.svg', 'hidden dark:block')}
          </>
        )}
      </span>
      {fx && <span className="logo-shine" aria-hidden />}
    </Link>
  );
}
