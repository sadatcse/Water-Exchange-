import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { keyServices, coreServices, services, processSteps } from '@/data/company';
import DarkPageHeader from '@/components/ui/DarkPageHeader';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Reveal from '@/components/site/Reveal';
import SectionHeading from '@/components/site/SectionHeading';
import CtaBand from '@/components/site/CtaBand';

export const metadata = {
  title: 'Services',
  description: `ETP, STP and WTP design and installation, DOE water testing and clearance, plus waste management, research and environmental consultancy by ${siteConfig.name}.`,
};

export default function ServicesPage() {
  return (
    <div className="bg-canvas">
      <DarkPageHeader
        title="Our"
        accent="Services"
        subtitle="Treatment plants and DOE clearance at the core — and a full range of environmental consultancy beyond water."
        breadcrumbs={[{ label: 'Services' }]}
      />

      {/* Key services — the six service groups */}
      <section className="py-16 md:py-24">
        <Container className="max-w-7xl">
          <SectionHeading eyebrow="Our key services" title="Six ways we keep you" accent="compliant" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {keyServices.map(({ id, icon: Icon, title, items }, i) => (
              <Reveal
                key={id}
                id={id}
                delay={(i % 3) * 100}
                className="group relative scroll-mt-32 overflow-hidden rounded-3xl border border-line/10 bg-surface p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 target:border-cyan-500 target:shadow-2xl target:shadow-cyan-500/20"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-cyan-500 text-2xl text-white shadow-lg shadow-cyan-500/25 transition-transform group-hover:rotate-6">
                  <Icon aria-hidden />
                </span>
                <h2 className="mt-6 text-xl font-bold">{title}</h2>
                <ul className="mt-4 space-y-2.5 text-sm text-body">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <FaCheckCircle className="mt-0.5 shrink-0 text-cyan-500" aria-hidden /> {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Treatment plants & clearance — alternating detail rows */}
      <section className="bg-canvas-2 py-16 md:py-24">
        <Container className="max-w-6xl space-y-10 md:space-y-16">
          <SectionHeading eyebrow="Treatment plants & clearance" title="ETP, STP, WTP &" accent="DOE" />
          {coreServices.map(({ id, icon: Icon, short, title, text, points }, i) => (
            <Reveal
              key={id}
              id={id}
              className="grid scroll-mt-32 items-center gap-8 rounded-3xl border border-line/10 bg-surface p-6 shadow-sm md:grid-cols-[1fr_1.3fr] md:p-10"
            >
              <div className={i % 2 ? 'md:order-2' : ''}>
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-abyss via-sky-800 to-cyan-600">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-300/25 blur-2xl" aria-hidden />
                  <svg className="absolute inset-x-0 bottom-0 h-16 w-full opacity-40" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden>
                    <path d="M0 30 C 70 55 130 5 200 30 C 270 55 330 5 400 30 L400 60 L0 60 Z" fill="white" fillOpacity="0.3" />
                  </svg>
                  <span className="absolute left-5 top-4 text-6xl font-extrabold text-white/10">{String(i + 1).padStart(2, '0')}</span>
                  <span className="relative flex h-24 w-24 animate-float items-center justify-center rounded-3xl bg-white/15 text-4xl text-white shadow-2xl backdrop-blur">
                    <Icon aria-hidden />
                  </span>
                  <span className="absolute bottom-4 right-5 text-3xl font-extrabold text-white/90">{short}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700 dark:text-cyan-300">Core service · {short}</p>
                <h2 className="mt-2 text-2xl font-extrabold md:text-3xl">{title}</h2>
                <p className="mt-4 leading-relaxed text-muted">{text}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {points.map((p) => (
                    <li key={p} className="flex items-center gap-2 font-medium text-ink">
                      <FaCheckCircle className="shrink-0 text-cyan-500" aria-hidden /> {p}
                    </li>
                  ))}
                </ul>
                <Button href="/contact#contact-form" variant="brand" className="mt-8 rounded-full">
                  Ask about {short} <FaArrowRight aria-hidden />
                </Button>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* All consultancy services */}
      <section className="py-16 md:py-24">
        <Container className="max-w-7xl">
          <SectionHeading
            eyebrow="Environmental consultancy"
            title={`${services.length} services`}
            accent="beyond water"
            subtitle="From waste characterization to carbon credits — research-backed solutions for industry, communities and development partners."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={(i % 4) * 80}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-line/10 bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10">
                  <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-sky-700 to-cyan-500 transition-transform duration-500 group-hover:scale-x-100" aria-hidden />
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-xl text-sky-700 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-sky-700 group-hover:to-cyan-500 group-hover:text-white dark:text-cyan-300">
                    <Icon aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Process strip */}
      <section className="bg-canvas-2 py-16 md:py-24">
        <Container className="max-w-6xl">
          <SectionHeading eyebrow="How it works" title="Every project, the" accent="same clear steps" />
          <ol className="mt-12 grid gap-5 md:grid-cols-4">
            {processSteps.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 100} className="relative rounded-2xl border border-line/10 bg-surface p-6">
                <span className="text-5xl font-extrabold text-line/[0.06]">{String(i + 1).padStart(2, '0')}</span>
                <span className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-700 to-cyan-500 text-white">
                  <Icon aria-hidden />
                </span>
                <h3 className="mt-2 text-base">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <CtaBand />
    </div>
  );
}
