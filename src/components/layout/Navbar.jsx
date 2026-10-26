'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { mainNav } from '@/config/navigation';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

function isActive(pathname, href) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;

// Sticky site header: slim contact bar + main bar that turns solid once the page scrolls. Mobile (< lg): full-screen menu.
export default function Navbar() {
  const pathname = usePathname() || '/';
  // The menu remembers the page it was opened on, so navigating closes it
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === pathname;
  const setOpen = (value) => setOpenOn(value ? pathname : null);
  const [scrolled, setScrolled] = useState(false);
  const { phones, email } = siteConfig.contact;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock page scroll while the menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40">
      {/* Contact bar */}
      <div className="hidden bg-abyss text-xs text-sky-100/80 md:block">
        <Container className="flex h-9 max-w-7xl items-center justify-between gap-4">
          <p className="font-bangla">ETP, STP, WTP ডিজাইন, Installation এবং DOE ছাড়পত্র — শুরু থেকে শেষ পর্যন্ত</p>
          <div className="flex items-center gap-5">
            <a href={telHref(phones[0])} className="flex items-center gap-1.5 transition-colors hover:text-white">
              <FaPhoneAlt aria-hidden className="text-cyan-300" /> {phones[0]}
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
              <FaEnvelope aria-hidden className="text-cyan-300" /> {email}
            </a>
          </div>
        </Container>
      </div>

      <div
        className={cn(
          'border-b transition-all duration-300',
          scrolled || open ? 'border-line/10 bg-canvas/90 shadow-sm backdrop-blur-xl' : 'border-transparent bg-canvas/70 backdrop-blur-md'
        )}
      >
        <Container className={cn('flex max-w-7xl items-center justify-between gap-4 transition-all duration-300', scrolled ? 'h-16' : 'h-20')}>
          <Logo fx height={scrolled ? 48 : 58} className="transition-all duration-300" />

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {mainNav.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                    active ? 'text-sky-700 dark:text-cyan-300' : 'text-muted hover:text-ink'
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-gradient-to-r from-sky-700 to-cyan-500 transition-transform duration-300',
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    )}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:flex" />
            <Button href="/contact" variant="brand" className="hidden rounded-full lg:inline-flex">
              Free consultation
            </Button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-body hover:bg-line/5 lg:hidden"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </Container>
      </div>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[var(--menu-top)] z-40 overflow-y-auto bg-canvas lg:hidden" style={{ '--menu-top': scrolled ? '4rem' : '5rem' }}>
          <Container className="flex flex-col gap-1 py-4">
            <nav className="flex flex-col" aria-label="Mobile">
              {mainNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? 'page' : undefined}
                  className={cn(
                    'rounded-lg px-4 py-3.5 text-base font-semibold transition-colors',
                    isActive(pathname, link.href) ? 'bg-cyan-500/10 text-sky-700 dark:text-cyan-300' : 'text-body hover:bg-line/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Button href={telHref(phones[0])} variant="brand" size="lg">
                <FaPhoneAlt aria-hidden /> {phones[0]}
              </Button>
              <Button href={`mailto:${email}`} variant="secondary" size="lg">
                <FaEnvelope aria-hidden /> Email us
              </Button>
            </div>
            <ThemeToggle variant="row" className="mt-3" />
          </Container>
        </div>
      )}
    </header>
  );
}
