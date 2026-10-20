import { Fragment } from 'react';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa';
import Bubbles from '@/components/site/Bubbles';
import WaterWaves from '@/components/site/WaterWaves';

// Deep-water page banner with breadcrumb, title and optional extra content (tabs, etc.).
// breadcrumbs: [{ label, href? }] — "Home" is added automatically.
export default function DarkPageHeader({ title, accent, subtitle, breadcrumbs = [], children }) {
  const crumbs = [{ label: 'Home', href: '/' }, ...breadcrumbs];
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-abyss via-abyss-2 to-sky-800 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_10%,rgba(6,182,212,0.35),transparent_55%)]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" aria-hidden />
      <Bubbles />
      <div className="container relative max-w-7xl pb-24 pt-12 2xl:max-w-screen-2xl md:pb-32 md:pt-16">
        <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-sky-100/70">
          {crumbs.map((crumb, i) => (
            <Fragment key={`${crumb.label}-${i}`}>
              {i > 0 && <FaChevronRight className="text-[9px]" aria-hidden />}
              {crumb.href && i < crumbs.length - 1 ? (
                <Link href={crumb.href} className="hover:text-cyan-300">{crumb.label}</Link>
              ) : (
                <span className="font-medium text-white" aria-current="page">{crumb.label}</span>
              )}
            </Fragment>
          ))}
        </nav>
        {title && (
          <>
            <h1 className="text-4xl font-extrabold text-white md:text-5xl">
              {title} {accent && <span className="bg-gradient-to-r from-cyan-300 to-sky-300 bg-clip-text text-transparent">{accent}</span>}
            </h1>
            <span className="mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-sky-300" />
          </>
        )}
        {subtitle && <p className="mt-5 max-w-2xl text-lg text-sky-100/80">{subtitle}</p>}
        {children}
      </div>
      <WaterWaves />
    </header>
  );
}
