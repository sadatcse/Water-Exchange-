import Image from 'next/image';
import { FaUserTie } from 'react-icons/fa';
import { imageProps } from '@/lib/images';
import Reveal from './Reveal';

const initials = (name) => name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

function Photo({ member, className, sizes }) {
  return (
    <span className={`relative overflow-hidden ${className}`}>
      <Image src={member.photo} alt={member.name} {...imageProps(member.photo)} fill sizes={sizes} className="object-cover" />
    </span>
  );
}

// Featured member (large card) + the rest of the team. members: published team members from the server.
export default function TeamGrid({ members = [] }) {
  const featured = members.find((m) => m.featured);
  const rest = members.filter((m) => m !== featured);
  if (!members.length) return null;

  return (
    <div className={featured ? 'grid gap-6 lg:grid-cols-[1.1fr_2fr]' : ''}>
      {featured && (
        <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-abyss via-sky-800 to-cyan-600 p-8 text-white shadow-xl shadow-sky-900/20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" aria-hidden />
          {featured.photo ? (
            <Photo member={featured} sizes="96px" className="flex h-24 w-24 rounded-full ring-4 ring-white/20" />
          ) : (
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/15 text-4xl ring-4 ring-white/20 backdrop-blur">
              <FaUserTie aria-hidden />
            </span>
          )}
          <p className="relative mt-6 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">Leadership</p>
          <h3 className="relative mt-1 text-2xl text-white">{featured.name}</h3>
          <p className="relative mt-1 font-semibold text-sky-100">{featured.role}</p>
          {featured.credentials && <p className="relative mt-1 text-sm text-sky-100/75">{featured.credentials}</p>}
        </Reveal>
      )}
      <ul className="grid gap-5 sm:grid-cols-2">
        {rest.map((m, i) => (
          <Reveal as="li" key={m._id} delay={i * 90} className="group flex items-center gap-4 rounded-2xl border border-line/10 bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl">
            {m.photo ? (
              <Photo member={m} sizes="64px" className="flex h-16 w-16 shrink-0 rounded-2xl shadow-lg shadow-cyan-500/25" />
            ) : (
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-cyan-500 text-lg font-extrabold text-white shadow-lg shadow-cyan-500/25 transition-transform group-hover:rotate-3 group-hover:scale-105">
                {initials(m.name)}
              </span>
            )}
            <div>
              <h3 className="text-base">{m.name}</h3>
              <p className="text-sm text-muted">{m.role}</p>
              {m.credentials && <p className="text-xs text-subtle">{m.credentials}</p>}
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
