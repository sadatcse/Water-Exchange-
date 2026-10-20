import { cn } from '@/lib/utils';

const PATH = 'M0 40 C 150 80 350 0 600 40 C 850 80 1050 0 1200 40 L1200 120 L0 120 Z';
const LAYERS = [
  { opacity: 0.25, anim: 'animate-wave-slow', offset: 'bottom-3' },
  { opacity: 0.45, anim: 'animate-wave', offset: 'bottom-1' },
  { opacity: 1, anim: 'animate-wave-slow [animation-direction:reverse]', offset: 'bottom-0' },
];

// Animated layered waves along the bottom edge of a section. fill: colour of the section below.
export default function WaterWaves({ className, fill = 'rgb(var(--canvas))' }) {
  return (
    <div className={cn('pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden md:h-24', className)} aria-hidden>
      {LAYERS.map((layer, i) => (
        <svg
          key={i}
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
          className={cn('absolute left-0 h-full w-[200%]', layer.anim, layer.offset)}
          style={{ opacity: layer.opacity }}
        >
          <path d={PATH} fill={fill} />
          <path d={PATH} fill={fill} transform="translate(1200 0)" />
        </svg>
      ))}
    </div>
  );
}
