'use client';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

// Tilts in 3D towards the pointer (mouse / pen only). max: tilt in degrees.
export default function TiltCard({ max = 10, className, children }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || e.pointerType === 'touch') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn('transition-transform duration-300 ease-out [transform-style:preserve-3d]', className)}
    >
      {children}
    </div>
  );
}
