'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaLinkedinIn, FaGithub, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaArrowRight } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { exploreNav, legalNav } from '@/config/navigation';
import { keyServices, partners } from '@/data/company';
import { api } from '@/lib/api-client';
import Container from '@/components/ui/Container';
import Bubbles from '@/components/site/Bubbles';
import Logo from './Logo';

const SOCIAL_ICONS = { facebook: FaFacebookF, linkedin: FaLinkedinIn, github: FaGithub, youtube: FaYoutube };
const linkHover = 'transition-colors hover:text-cyan-300';

function FooterLinks({ title, links }) {
  return (
    <nav aria-label={title}>
      <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white">{title}</h4>
      <ul className="space-y-0.5 text-sm md:space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={`group flex items-center gap-2 py-1.5 text-sky-100/70 md:py-0 ${linkHover}`}>
              <FaArrowRight className="text-[9px] text-cyan-400 transition-transform group-hover:translate-x-0.5" aria-hidden />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ContactRow({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs text-cyan-300">
        <Icon aria-hidden />
      </span>
      <div className="min-w-0 flex-1 pt-1.5">{children}</div>
    </div>
  );
}

export default function Footer() {
  const [visitors, setVisitors] = useState(null);

  useEffect(() => {
    api.get('/visitor/summary').then((res) => setVisitors(res.data?.stats)).catch(() => {});
  }, []);

  const { contact } = siteConfig;
  const socials = Object.entries(siteConfig.social).filter(([key, url]) => url && SOCIAL_ICONS[key]);
  const serviceLinks = keyServices.map((s) => ({ label: s.title, href: `/services#${s.id}` }));

  return (
    <footer className="relative mt-auto overflow-hidden bg-abyss text-sky-100/80">
      {/* Wave edge */}
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block h-10 w-full bg-canvas md:h-14" aria-hidden>
        <path d="M0 30 C 240 70 480 0 720 30 C 960 60 1200 0 1440 30 L1440 60 L0 60 Z" fill="#04263a" />
      </svg>
      <Bubbles className="opacity-60" />
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden />

      <Container className="relative grid gap-x-10 gap-y-10 pb-12 pt-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo variant="light" height={72} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-sky-100/70">{siteConfig.description}</p>

          <div className="mt-6 space-y-3 text-sm">
            {contact.address && (
              <ContactRow icon={FaMapMarkerAlt}>
                {contact.mapUrl ? (
                  <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className={linkHover}>{contact.address}</a>
                ) : (
                  contact.address
                )}
              </ContactRow>
            )}
            {contact.email && (
              <ContactRow icon={FaEnvelope}>
                <a href={`mailto:${contact.email}`} className={`break-all ${linkHover}`}>{contact.email}</a>
              </ContactRow>
            )}
            {contact.phones?.length > 0 && (
              <ContactRow icon={FaPhoneAlt}>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {contact.phones.map((phone) => (
                    <a key={phone} href={`tel:${phone.replace(/[^\d+]/g, '')}`} className={`whitespace-nowrap ${linkHover}`}>{phone}</a>
                  ))}
                </div>
              </ContactRow>
            )}
          </div>

          {socials.length > 0 && (
            <div className="mt-6 flex gap-2">
              {socials.map(([key, url]) => {
                const Icon = SOCIAL_ICONS[key];
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-cyan-400 hover:bg-cyan-500"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <FooterLinks title="Explore" links={exploreNav} />
        <FooterLinks title="Key services" links={serviceLinks} />
        <FooterLinks title="Legal" links={legalNav} />
      </Container>

      <Container className="relative">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-5 md:flex-row md:justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">Worked with</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {partners.map((p) => (
              <li key={p.name} className="flex h-14 w-20 items-center justify-center rounded-xl bg-white p-2 transition-transform hover:-translate-y-0.5" title={p.name}>
                <Image src={p.logo} alt={p.name} width={64} height={48} className="max-h-full w-auto object-contain" />
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <Container className="relative flex flex-col items-center gap-3 py-6 text-center text-xs text-sky-100/50 md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} {siteConfig.name}. {siteConfig.tagline} All rights reserved.</p>
        {visitors && (
          <ul className="flex flex-wrap justify-center gap-2" aria-label="Visitors">
            {[
              ['Today', visitors.today],
              ['Total', visitors.total],
              ['Online', visitors.online],
            ].map(([label, value]) => (
              <li key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1">
                {label === 'Online' && <span className="h-1.5 w-1.5 rounded-full bg-green-400" aria-hidden />}
                {label}: <span className="font-semibold text-sky-100">{value}</span>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </footer>
  );
}
