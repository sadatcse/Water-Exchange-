import { cn } from '@/lib/utils';

// [left %, size px, delay s] — fixed so server and client render the same markup
const BUBBLES = [
  [6, 10, 0], [14, 18, 3], [22, 8, 7], [31, 14, 1.5], [42, 6, 5], [51, 20, 9], [60, 9, 2.5],
  [68, 16, 6], [76, 7, 4], [84, 22, 8], [91, 12, 1], [96, 8, 10],
];

// Rising air bubbles for dark water sections
export default function Bubbles({ className }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {BUBBLES.map(([left, size, delay], i) => (
        <span
          key={i}
          className="absolute -bottom-10 animate-rise rounded-full border border-white/30 bg-white/10"
          style={{ left: `${left}%`, width: size, height: size, animationDelay: `${delay}s`, animationDuration: `${10 + (i % 5) * 2}s` }}
        />
      ))}
    </div>
  );
}
