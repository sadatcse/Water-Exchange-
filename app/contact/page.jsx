import Link from 'next/link';
import { Fragment } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { getProductBySlug } from '@/server/services/product.service';
import Container from '@/components/ui/Container';
import ContactForm from '@/components/forms/ContactForm';
import ContactHeroSlider from '@/components/site/ContactHeroSlider';
import Bubbles from '@/components/site/Bubbles';
import WaterWaves from '@/components/site/WaterWaves';
import Reveal from '@/components/site/Reveal';
import { pageMetadata } from '@/lib/seo';

export const generateMetadata = () =>
  pageMetadata({
    title: 'Contact Us',
    description: `Get in touch with ${siteConfig.name} — ETP, STP, WTP design and installation, DOE water testing and clearance. Call ${siteConfig.contact.phones[0]}.`,
    path: '/contact',
  });

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;

function InfoCard({ icon: Icon, title, children, delay }) {
  return (
    <Reveal delay={delay} className="group flex items-start gap-4 rounded-2xl border border-line/10 bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-700 to-cyan-500 text-lg text-white shadow-lg shadow-cyan-500/25 transition-transform group-hover:scale-110">
        <Icon aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-subtle">{title}</p>
        <div className="mt-1.5 font-semibold text-ink">{children}</div>
      </div>
    </Reveal>
  );
}

export default async function ContactPage({ searchParams }) {
  const { contact } = siteConfig;
  // "Request a quotation" on a product page links here with ?product=<slug>
  const quoteFor = await getProductBySlug((await searchParams).product);
  const phone = contact.phones[0];

  const slides = [
    {
      id: 'call',
      icon: 'phone',
      eyebrow: 'Talk to an engineer',
      title: 'Call us directly',
      text: `Questions about an ETP, STP or WTP — or a DOE deadline coming up? Call ${phone} and speak to an engineer.`,
      action: { label: `Call ${phone}`, href: telHref(phone) },
      tone: 'bg-gradient-to-br from-sky-600 via-sky-700 to-abyss',
    },
    {
      id: 'renewal',
      icon: 'clearance',
      eyebrow: 'DOE clearance',
      title: 'Renew your ছাড়পত্র on time',
      text: 'We arrange the water tests, prepare the documents and follow your clearance application or renewal through to the end.',
      action: { label: 'Send your details', href: '#contact-form' },
      tone: 'bg-gradient-to-br from-cyan-500 via-teal-600 to-sky-900',
    },
    {
      id: 'visit',
      icon: 'map',
      eyebrow: 'Visit our office',
      title: 'New DOHS Mohakhali',
      text: contact.address,
      action: contact.mapUrl ? { label: 'Open in Maps', href: contact.mapUrl, external: true } : null,
      tone: 'bg-gradient-to-br from-blue-600 via-indigo-700 to-abyss',
    },
    {
      id: 'quote',
      icon: 'plant',
      eyebrow: 'Plan a project',
      title: 'Get a treatment plant quote',
      text: 'Tell us about your facility and water use — we’ll arrange a site visit and send a proposal for design and installation.',
      action: { label: 'Request a quote', href: '#contact-form' },
      tone: 'bg-gradient-to-br from-sky-500 via-cyan-600 to-teal-800',
    },
    {
      id: 'email',
      icon: 'email',
      eyebrow: 'Write to us',
      title: 'Email the team',
      text: `Send drawings, test reports or questions to ${contact.email} — we reply as soon as we can.`,
      action: { label: 'Send an email', href: `mailto:${contact.email}` },
      tone: 'bg-gradient-to-br from-teal-500 via-sky-700 to-indigo-900',
    },
  ];

  return (
    <div className="bg-canvas">
      {/* 3D hero slider */}
      <header className="relative overflow-hidden bg-gradient-to-br from-abyss via-abyss-2 to-sky-900 pb-28 text-white md:pb-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(34,211,238,0.28),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" aria-hidden />
        <Bubbles />
        <Container className="relative max-w-7xl pt-10 md:pt-14">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm text-sky-100/70">
            {[{ label: 'Home', href: '/' }, { label: 'Contact' }].map((crumb, i) => (
              <Fragment key={crumb.label}>
                {i > 0 && <FaChevronRight className="text-[9px]" aria-hidden />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-cyan-300">{crumb.label}</Link>
                ) : (
                  <span className="font-medium text-white" aria-current="page">{crumb.label}</span>
                )}
              </Fragment>
            ))}
          </nav>
          <Reveal className="mx-auto mt-5 max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold text-white md:text-6xl">
              Let’s talk <span className="bg-gradient-to-r from-cyan-300 to-sky-300 bg-clip-text text-transparent">water</span>
            </h1>
            <p className="mt-4 text-lg text-sky-100/80">Pick the way that suits you — call, visit, write or send your project details.</p>
          </Reveal>
          <div className="mt-10 md:mt-12">
            <ContactHeroSlider slides={slides} />
          </div>
        </Container>
        <WaterWaves />
      </header>

      {/* Quick contact cards */}
      <section className="relative z-10 -mt-14 md:-mt-20">
        <Container className="grid max-w-6xl gap-5 md:grid-cols-3">
          <InfoCard icon={FaPhoneAlt} title="Phone">
            <div className="flex flex-col gap-1">
              {contact.phones.map((p) => (
                <a key={p} href={telHref(p)} className="hover:text-sky-700 dark:hover:text-cyan-300">{p}</a>
              ))}
            </div>
          </InfoCard>
          <InfoCard icon={FaEnvelope} title="Email" delay={100}>
            <a href={`mailto:${contact.email}`} className="break-all hover:text-sky-700 dark:hover:text-cyan-300">{contact.email}</a>
          </InfoCard>
          <InfoCard icon={FaMapMarkerAlt} title="Office" delay={200}>
            {contact.mapUrl ? (
              <a href={contact.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-sky-700 dark:hover:text-cyan-300">{contact.address}</a>
            ) : (
              contact.address
            )}
          </InfoCard>
        </Container>
      </section>

      {/* Form + map */}
      <section id="contact-form" className="scroll-mt-28 py-16 md:py-24">
        <Container className="grid max-w-6xl gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="rounded-3xl border border-line/10 bg-surface p-6 shadow-xl shadow-sky-900/5 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700 dark:text-cyan-300">Send a message</p>
            <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">
              Tell us about your <span className="text-brand">project</span>
            </h2>
            <p className="mt-2 text-sm text-muted">Pick a topic, add a few details and we’ll get back to you.</p>
            <div className="mt-8">
              <ContactForm defaultSubject={quoteFor ? `Quotation: ${quoteFor.name}` : ''} />
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            {contact.mapEmbed && (
              <Reveal delay={100} className="overflow-hidden rounded-3xl border border-line/10 shadow-xl shadow-sky-900/5">
                <iframe title={`Map — ${contact.address}`} src={contact.mapEmbed} className="h-72 w-full lg:h-80" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </Reveal>
            )}
            <Reveal delay={200} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 to-cyan-500 p-7 text-white shadow-xl shadow-cyan-500/20">
              <Bubbles />
              <div className="relative">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">Your consultant</p>
                <p className="mt-2 text-xl font-extrabold">{siteConfig.founder.name}</p>
                <p className="text-sm text-sky-50/90">{siteConfig.founder.title}</p>
                <p className="mt-1 text-xs text-sky-50/75">{siteConfig.founder.credentials}</p>
                <a href={telHref(phone)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-sky-800 shadow-lg transition-transform hover:-translate-y-0.5">
                  <FaPhoneAlt aria-hidden /> {phone}
                </a>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <Link href="/services" className="group flex items-center justify-between rounded-2xl border border-line/10 bg-surface p-5 font-semibold text-ink transition-colors hover:border-cyan-500/40">
                Not sure what you need? See our services
                <FaArrowRight className="text-cyan-500 transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
}
