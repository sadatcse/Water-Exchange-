// Theme-aware colour tokens: each maps to a CSS variable set in src/styles/globals.css for
// light (:root) and dark (.dark). Use them instead of fixed greys so pages work in both modes:
//   bg-canvas (page) · bg-canvas-2 · bg-surface (cards) · bg-surface-2 · text-ink (headings) · text-ink-2
//   text-body · text-muted · text-subtle · text-faint · border-line/10 (hairlines; also bg-line/5 tints)
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx}', './app/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
    },
    extend: {
      screens: { '3xl': '1920px' },
      colors: {
        canvas: { DEFAULT: token('canvas'), 2: token('canvas-2') },
        surface: { DEFAULT: token('surface'), 2: token('surface-2') },
        ink: { DEFAULT: token('ink'), 2: token('ink-2') },
        body: token('body'),
        muted: token('muted'),
        subtle: token('subtle'),
        faint: token('faint'),
        line: token('line'),
        // Change this scale to re-brand the dashboard (Water Exchange blue).
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        // Deep water tone for dark sections (heroes, footer)
        abyss: { DEFAULT: '#04263a', 2: '#063a55' },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        bangla: ['var(--font-bangla)', 'var(--font-sans)', 'sans-serif'],
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
        wave: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        rise: {
          '0%': { transform: 'translateY(0) scale(0.6)', opacity: '0' },
          '15%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-110vh) scale(1.1)', opacity: '0' },
        },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        flow: { to: { strokeDashoffset: '-40' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        wave: 'wave 14s linear infinite',
        'wave-slow': 'wave 22s linear infinite',
        rise: 'rise 12s linear infinite',
        marquee: 'marquee 32s linear infinite',
        'spin-slow': 'spin-slow 40s linear infinite',
        flow: 'flow 1.2s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
