'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { FaChevronLeft, FaChevronRight, FaPause, FaPlay, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFileSignature, FaIndustry } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const AUTOPLAY_MS = 5500;
// Slides name their icon (components can't be passed from a server page to this client component)
const ICONS = { phone: FaPhoneAlt, email: FaEnvelope, map: FaMapMarkerAlt, clearance: FaFileSignature, plant: FaIndustry };
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeMotion(callback) {
  const media = window.matchMedia(REDUCED_MOTION);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

// Relative position of slide i to the active one, wrapped to the nearest side (… -2 -1 0 1 2 …)
function offsetOf(i, active, count) {
  let d = i - active;
  if (d > count / 2) d -= count;
  if (d < -count / 2) d += count;
  return d;
}

// 3D coverflow hero. slides: [{ id, icon: keyof ICONS, eyebrow, title, text, action: { label, href, external? }, tone }]
export default function ContactHeroSlider({ slides }) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  // null = not chosen by the visitor yet → autoplay unless they prefer less motion
  const [playChoice, setPlayChoice] = useState(null);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false);
  const playing = playChoice ?? !reducedMotion;
  const [hovered, setHovered] = useState(false);
  const stageRef = useRef(null);
  const dragStart = useRef(null);

  const go = useCallback((i) => setActive(((i % count) + count) % count), [count]);
  const next = useCallback(() => setActive((a) => (a + 1) % count), [count]);
  const prev = useCallback(() => setActive((a) => (a - 1 + count) % count), [count]);

  // Autoplay (restarts whenever the slide changes, pauses on hover / focus)
  useEffect(() => {
    if (!playing || hovered) return undefined;
    const t = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, playing, hovered, next]);

  // Tilt the stage towards the pointer
  const onPointerMove = (e) => {
    const el = stageRef.current;
    if (!el || e.pointerType === 'touch') return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--tilt-x', `${(((e.clientY - r.top) / r.height - 0.5) * -8).toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${(((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2)}deg`);
  };
  const resetTilt = () => {
    stageRef.current?.style.setProperty('--tilt-x', '0deg');
    stageRef.current?.style.setProperty('--tilt-y', '0deg');
  };

  // Swipe
  const onPointerDown = (e) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (dragStart.current == null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    }
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Ways to contact us"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        resetTilt();
      }}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragStart.current = null)}
        className="relative mx-auto h-[25rem] touch-pan-y select-none outline-none [perspective:1400px] focus-visible:ring-2 focus-visible:ring-cyan-300/60 sm:h-[24rem] md:h-[26rem]"
        style={{ '--tilt-x': '0deg', '--tilt-y': '0deg' }}
      >
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out [transform-style:preserve-3d]"
          style={{ transform: 'rotateX(var(--tilt-x)) rotateY(var(--tilt-y))' }}
        >
          {slides.map((slide, i) => {
            const d = offsetOf(i, active, count);
            const abs = Math.abs(d);
            const isActive = d === 0;
            const Icon = ICONS[slide.icon] || FaIndustry;
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${slide.title}`}
                aria-hidden={!isActive}
                onClick={isActive ? undefined : () => go(i)}
                className={cn(
                  'absolute left-1/2 top-1/2 w-[82%] max-w-xl transition-all duration-700 [transform-style:preserve-3d] [transition-timing-function:cubic-bezier(0.22,0.8,0.24,1)] sm:w-[68%] md:w-[56%]',
                  !isActive && 'cursor-pointer'
                )}
                style={{
                  transform: `translate(-50%, -50%) translateX(${d * 58}%) translateZ(${-abs * 220}px) rotateY(${d * -38}deg)`,
                  opacity: abs > 2 ? 0 : abs === 2 ? 0.35 : 1,
                  zIndex: 20 - abs,
                  pointerEvents: abs > 2 ? 'none' : undefined,
                }}
              >
                <div
                  inert={!isActive}
                  className={cn(
                    'relative overflow-hidden rounded-[2rem] border border-white/15 p-7 text-white shadow-2xl shadow-black/40 transition-[filter] duration-700 [transform-style:preserve-3d] md:p-9',
                    slide.tone,
                    !isActive && 'brightness-[0.55] saturate-75'
                  )}
                >
                  {/* Decorative water layers */}
                  <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full opacity-30" viewBox="0 0 600 100" preserveAspectRatio="none" aria-hidden>
                    <path d="M0 50 C 100 90 200 10 300 50 C 400 90 500 10 600 50 L600 100 L0 100 Z" fill="white" fillOpacity="0.25" />
                    <path d="M0 70 C 120 40 240 100 360 70 C 480 40 540 90 600 70 L600 100 L0 100 Z" fill="white" fillOpacity="0.35" />
                  </svg>
                  <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/15 blur-2xl" aria-hidden />
                  <Icon className="pointer-events-none absolute -bottom-6 -right-4 text-[9rem] text-white/10" aria-hidden />

                  <div className="relative" style={{ transform: 'translateZ(40px)' }}>
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl shadow-lg backdrop-blur" style={{ transform: 'translateZ(30px)' }}>
                      <Icon aria-hidden />
                    </span>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-white/75">{slide.eyebrow}</p>
                    <h2 className="mt-2 text-2xl font-extrabold text-white md:text-3xl">{slide.title}</h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85 md:text-base">{slide.text}</p>
                    {slide.action && (
                      <a
                        href={slide.action.href}
                        {...(slide.action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-sky-800 shadow-lg transition-transform hover:-translate-y-0.5"
                      >
                        {slide.action.label} <FaChevronRight className="text-xs" aria-hidden />
                      </a>
                    )}
                  </div>
                </div>
                {/* Reflection */}
                <div
                  className="pointer-events-none absolute inset-x-6 -bottom-6 h-10 rounded-full bg-black/40 blur-xl transition-opacity duration-700"
                  style={{ opacity: isActive ? 0.8 : 0.3 }}
                  aria-hidden
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-30 mt-8 flex items-center justify-center gap-4">
        <button type="button" onClick={prev} aria-label="Previous slide" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20">
          <FaChevronLeft aria-hidden />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}: ${slide.title}`}
              aria-current={i === active ? 'true' : undefined}
              className={cn('relative h-2.5 overflow-hidden rounded-full bg-white/25 transition-all duration-500', i === active ? 'w-10' : 'w-2.5 hover:bg-white/50')}
            >
              {i === active && (
                <span
                  key={`${active}-${playing && !hovered}`}
                  className={cn('absolute inset-y-0 left-0 rounded-full bg-cyan-300', playing && !hovered ? 'animate-[slide-progress_linear_forwards]' : 'w-full')}
                  style={playing && !hovered ? { animationDuration: `${AUTOPLAY_MS}ms` } : undefined}
                />
              )}
            </button>
          ))}
        </div>
        <button type="button" onClick={next} aria-label="Next slide" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20">
          <FaChevronRight aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setPlayChoice(!playing)}
          aria-label={playing ? 'Pause autoplay' : 'Start autoplay'}
          className="ml-2 flex h-9 w-9 items-center justify-center rounded-full text-xs text-white/70 transition-colors hover:text-white"
        >
          {playing ? <FaPause aria-hidden /> : <FaPlay aria-hidden />}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        Slide {active + 1} of {count}: {slides[active].title}
      </p>
    </div>
  );
}
