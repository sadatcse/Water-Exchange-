import { FaUserTie } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { team } from '@/data/company';
import Reveal from './Reveal';

const initials = (name) => name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

// Founder card + team members (initials until photos are added)
export default function TeamGrid() {
  const { founder } = siteConfig;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_2fr]">
      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-abyss via-sky-800 to-cyan-600 p-8 text-white shadow-xl shadow-sky-900/20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" aria-hidden />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/15 text-4xl ring-4 ring-white/20 backdrop-blur">
          <FaUserTie aria-hidden />
        </span>
        <p className="relative mt-6 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Founder</p>
        <h3 className="relative mt-1 text-2xl text-white">{founder.name}</h3>
        <p className="relative mt-1 font-semibold text-sky-100">{founder.title}</p>
        <p className="relative mt-1 text-sm text-sky-100/75">{founder.credentials}</p>
      </Reveal>
      <ul className="grid gap-5 sm:grid-cols-2">
        {team.map((m, i) => (
          <Reveal as="li" key={m.name} delay={i * 90} className="group flex items-center gap-4 rounded-2xl border border-line/10 bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-cyan-500 text-lg font-extrabold text-white shadow-lg shadow-cyan-500/25 transition-transform group-hover:rotate-3 group-hover:scale-105">
              {initials(m.name)}
            </span>
            <div>
              <h3 className="text-base">{m.name}</h3>
              <p className="text-sm text-muted">{m.role}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
