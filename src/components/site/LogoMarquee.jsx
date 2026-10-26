import Image from 'next/image';
import { imageProps } from '@/lib/images';
import { cn } from '@/lib/utils';

// Endless scrolling strip of logos. items: [{ name, logo }]. reverse: scroll the other way.
export default function LogoMarquee({ items, reverse = false, label = 'Clients' }) {
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <ul
        className={cn('flex w-max animate-marquee gap-5 py-2 hover:[animation-play-state:paused]', reverse && '[animation-direction:reverse]')}
        aria-label={label}
      >
        {[...items, ...items].map((item, i) => (
          <li
            key={`${item.logo}-${i}`}
            aria-hidden={i >= items.length || undefined}
            className="flex h-24 w-44 shrink-0 items-center justify-center rounded-2xl border border-line/10 bg-white p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            title={item.name || undefined}
          >
            <Image src={item.logo} alt={item.name || 'Client logo'} {...imageProps(item.logo)} width={160} height={80} className="max-h-full w-auto object-contain" />
          </li>
        ))}
      </ul>
    </div>
  );
}
