import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaCheckCircle, FaPhoneAlt, FaQuoteLeft, FaQuoteRight, FaShieldAlt, FaHardHat } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import {
  coreServices, keyServices, expertise, whyChooseUs, processSteps, homeFaqs, articles, clients, facts, promises,
  mission, vision, ceoMessage, projects,
} from '@/data/company';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Reveal from '@/components/site/Reveal';
import SectionHeading from '@/components/site/SectionHeading';
import WaterWaves from '@/components/site/WaterWaves';
import Bubbles from '@/components/site/Bubbles';
import TiltCard from '@/components/site/TiltCard';
import LogoMarquee from '@/components/site/LogoMarquee';
import CountUp from '@/components/site/CountUp';
import PosterGallery from '@/components/site/PosterGallery';
import TeamGrid from '@/components/site/TeamGrid';
import Faq from '@/components/site/Faq';
import CtaBand, { telHref } from '@/components/site/CtaBand';

// Hero visual: the journey from raw water to DOE clearance
function FlowCard() {
  return (
    <TiltCard max={8} className="relative mx-auto w-full max-w-md">
      <div className="glass relative rounded-3xl p-6 shadow-2xl shadow-black/30 md:p-8">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">From raw water to clearance</p>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Start to finish
          </span>
        </div>
        <ol className="relative mt-6 space-y-5">
          {/* Flowing pipe behind the steps */}
          <svg className="absolute left-[21px] top-4 h-[calc(100%-2rem)] w-1" preserveAspectRatio="none" viewBox="0 0 2 100" aria-hidden>
            <line x1="1" y1="0" x2="1" y2="100" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
            <line x1="1" y1="0" x2="1" y2="100" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6 14" className="animate-flow" />
          </svg>
          {coreServices.map(({ icon: Icon, short, title }, i) => (
            <li key={short} className="relative flex items-center gap-4" style={{ transform: `translateZ(${20 + i * 10}px)` }}>
              <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-cyan-500/30">
                <Icon aria-hidden />
              </span>
              <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
                <p className="text-sm font-bold text-white">{short}</p>
                <p className="truncate text-xs text-sky-100/70">{title}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      {/* Floating badges */}
      <div className="absolute -right-3 -top-12 animate-float rounded-2xl bg-white px-4 py-3 text-sky-900 shadow-xl sm:-top-5 md:-right-8" style={{ transform: 'translateZ(60px)' }}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">100+ projects</p>
        <p className="text-sm font-extrabold">Stress-Free Guarantee</p>
      </div>
      <div className="absolute -bottom-6 -left-3 animate-float rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3 text-white shadow-xl [animation-delay:1.5s] md:-left-8">
        <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-100">Every year</p>
        <p className="text-sm font-extrabold">2 DoE-standard water tests</p>
      </div>
    </TiltCard>
  );
}

export default function HomePage() {
  const phone = siteConfig.contact.phones[0];
  return (
    <div className="bg-canvas text-body">
      {/* Hero */}
      <section className="relative -mt-px overflow-hidden bg-gradient-to-br from-abyss via-abyss-2 to-sky-800 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(34,211,238,0.30),transparent_55%)]" />
        <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" aria-hidden />
        <Bubbles />
        <Container className="relative grid max-w-7xl items-center gap-14 pb-36 pt-14 md:pt-20 lg:grid-cols-[1.15fr_1fr] lg:pb-44">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" /> {siteConfig.tagline}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
                Clean water.
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-200 bg-clip-text text-transparent">Clear compliance.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 font-bangla text-lg leading-relaxed text-sky-50 md:text-xl">
                ETP, STP, WTP ডিজাইন, Installation এবং পরিবেশ অধিদপ্তরের (DOE) Water Test ও ছাড়পত্র বিষয়ক পরামর্শদাতা — শুরু থেকে শেষ পর্যন্ত।
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-sky-100/75">{siteConfig.description}</p>
            </Reveal>
            <Reveal delay={300} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact" variant="white" size="lg" className="rounded-full">
                Get a free consultation <FaArrowRight aria-hidden />
              </Button>
              <Button href={telHref(phone)} variant="glass" size="lg" className="rounded-full">
                <FaPhoneAlt aria-hidden /> {phone}
              </Button>
            </Reveal>
            <Reveal delay={400}>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-sky-100/80">
                {['Yearly EC Certificate renewal', 'ETP · STP · WTP design', 'Industries & hospitals'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <FaCheckCircle className="text-cyan-300" aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={200} className="[perspective:1200px]">
            <FlowCard />
          </Reveal>
        </Container>
        <WaterWaves />
      </section>

      {/* Clients & partners */}
      <section className="relative z-10 -mt-6 space-y-4 pb-4">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-subtle">Trusted by 100+ companies and hospitals</p>
        <LogoMarquee items={clients} label="Clients" />
      </section>

      {/* Interesting facts */}
      <section className="py-16 md:py-20">
        <Container className="max-w-7xl">
          <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-abyss via-sky-900 to-sky-700 p-8 text-white shadow-2xl shadow-sky-900/20 md:p-12">
            <Bubbles />
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden />
            <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Interesting facts about us</p>
            <div className="relative mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label} className="border-l-2 border-cyan-400/40 pl-5">
                  <p className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-5xl font-extrabold text-transparent">
                    <CountUp value={f.value} suffix={f.suffix} />
                  </p>
                  <p className="mt-2 font-bold text-white">{f.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-sky-100/70">{f.text}</p>
                </div>
              ))}
            </div>
            <div className="relative mt-10 grid gap-4 border-t border-white/10 pt-8 md:grid-cols-2">
              {promises.map((p, i) => {
                const Icon = i ? FaHardHat : FaShieldAlt;
                return (
                  <div key={p.title} className="glass flex items-start gap-4 rounded-2xl p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white">
                      <Icon aria-hidden />
                    </span>
                    <div>
                      <p className="font-bold text-white">{p.title}</p>
                      <p className="mt-1 text-sm text-sky-100/75">{p.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Key services */}
      <section className="py-16 md:py-20">
        <Container className="max-w-7xl">
          <SectionHeading
            eyebrow="Our key services"
            title="Everything your facility needs to"
            accent="stay compliant"
            subtitle="From yearly water tests and paper renewals to treatment plant drawings, machinery and power plant clearance."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {keyServices.map(({ id, icon: Icon, title, items }, i) => (
              <Reveal key={id} delay={(i % 3) * 100}>
                <Link
                  href={`/services#${id}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line/10 bg-surface p-7 transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10"
                >
                  <span className="pointer-events-none absolute -right-4 -top-6 text-[6.5rem] font-extrabold leading-none text-line/[0.04] transition-colors group-hover:text-cyan-500/10" aria-hidden>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-cyan-500 text-2xl text-white shadow-lg shadow-cyan-500/25 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <Icon aria-hidden />
                  </span>
                  <h3 className="relative mt-6 text-xl">{title}</h3>
                  <ul className="relative mt-4 space-y-2.5 text-sm text-body">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <FaCheckCircle className="mt-0.5 shrink-0 text-cyan-500" aria-hidden /> {item}
                      </li>
                    ))}
                  </ul>
                  <span className="relative mt-auto flex items-center gap-2 pt-6 text-sm font-bold text-sky-700 dark:text-cyan-300">
                    Learn more <FaArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Mission, vision & CEO's message */}
      <section className="bg-canvas-2 py-16 md:py-24">
        <Container className="grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionHeading align="left" eyebrow="Who we are" title="Mission &" accent="vision" />
            {[mission, vision].map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 120} className="group flex gap-5 rounded-3xl border border-line/10 bg-surface p-6 transition-shadow hover:shadow-xl md:p-7">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-cyan-500 text-xl text-white shadow-lg shadow-cyan-500/25 transition-transform group-hover:rotate-6">
                  <Icon aria-hidden />
                </span>
                <div>
                  <h3 className="text-xl">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150} className="[perspective:1400px]">
            <TiltCard max={6} className="h-full">
              <figure className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-abyss via-sky-800 to-cyan-600 p-8 text-white shadow-2xl shadow-sky-900/25 md:p-10">
                <Bubbles />
                <FaQuoteRight className="pointer-events-none absolute -right-4 bottom-6 text-[10rem] text-white/5" aria-hidden />
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">CEO’s message</p>
                  <FaQuoteLeft className="mt-6 text-3xl text-cyan-300" aria-hidden />
                  <blockquote className="mt-4">
                    <p className="text-2xl font-extrabold leading-snug text-white md:text-3xl">{ceoMessage.headline}</p>
                    <p className="mt-4 leading-relaxed text-sky-100/85">{ceoMessage.text}</p>
                  </blockquote>
                </div>
                <figcaption className="relative mt-8 flex items-center gap-4 border-t border-white/15 pt-6">
                  <Image src="/brand/wx-light.svg" alt="" width={80} height={60} unoptimized className="h-12 w-auto" />
                  <div>
                    <p className="font-bold text-white">{siteConfig.founder.name}</p>
                    <p className="text-sm text-sky-100/75">{siteConfig.founder.title}</p>
                  </div>
                </figcaption>
              </figure>
            </TiltCard>
          </Reveal>
        </Container>
      </section>

      {/* Why choose us */}
      <section className="py-16 md:py-24">
        <Container className="grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="[perspective:1400px]">
            <TiltCard max={8} className="relative mx-auto max-w-md">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-sky-500/30 to-cyan-400/30 blur-2xl" aria-hidden />
              <Image
                src="/images/projects/high-end-consultancy.webp"
                alt="The high-end environment consultancy firm in Bangladesh"
                width={540}
                height={540}
                className="relative rounded-[2rem] border-4 border-white shadow-2xl dark:border-surface"
              />
              <div className="absolute -bottom-6 -right-4 animate-float rounded-2xl bg-white px-5 py-4 text-sky-900 shadow-xl md:-right-10" style={{ transform: 'translateZ(60px)' }}>
                <p className="text-3xl font-extrabold">
                  <CountUp value={100} suffix="+" />
                </p>
                <p className="text-xs font-semibold text-sky-700">Companies &amp; hospitals</p>
              </div>
            </TiltCard>
          </Reveal>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Why choose us"
              title="Compliance without"
              accent="the stress"
              subtitle="Industries and hospitals focus on their core operations — we handle the environmental documentation with speed, transparency and integrity."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {whyChooseUs.map(({ icon: Icon, title, text }, i) => (
                <Reveal key={title} delay={i * 100} className="group rounded-2xl border border-line/10 bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-lg text-sky-700 transition-colors group-hover:bg-gradient-to-br group-hover:from-sky-700 group-hover:to-cyan-500 group-hover:text-white dark:text-cyan-300">
                      <Icon aria-hidden />
                    </span>
                    <span className="text-3xl font-extrabold text-line/10">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h3 className="mt-4 text-base leading-snug">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Working process */}
      <section className="relative overflow-hidden bg-gradient-to-br from-abyss via-abyss-2 to-sky-900 py-20 text-white md:py-28">
        <Bubbles />
        <Container className="relative max-w-7xl">
          <SectionHeading onDark eyebrow="How we work" title="A clear path to" accent="compliance" subtitle="Four steps, one team — you always know what happens next." />
          <div className="relative mt-16">
            <div className="absolute left-[12%] right-[12%] top-8 hidden h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent md:block" aria-hidden />
            <ol className="grid gap-10 md:grid-cols-4 md:gap-6">
              {processSteps.map(({ icon: Icon, title, text }, i) => (
                <Reveal as="li" key={title} delay={i * 150} className="relative text-center">
                  <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-2xl text-white shadow-lg shadow-cyan-500/30">
                    <Icon aria-hidden />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-extrabold text-sky-800">{i + 1}</span>
                  </span>
                  <h3 className="mt-6 text-lg text-white">{title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-sky-100/70">{text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* Our expertise */}
      <section className="py-16 md:py-24">
        <Container className="max-w-7xl">
          <SectionHeading
            eyebrow="Our expertise"
            title="Environmental"
            accent="consultancy"
            subtitle="Research, assessment and waste expertise for industry, government and development partners."
          />
          <div className="mt-14 grid gap-5 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-4">
            {expertise.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={(i % 4) * 80}>
                <TiltCard max={8} className="h-full">
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-line/10 bg-surface p-6 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10">
                    <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-sky-700 to-cyan-500 transition-transform duration-500 group-hover:scale-x-100" aria-hidden />
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-xl text-sky-700 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-sky-700 group-hover:to-cyan-500 group-hover:text-white dark:text-cyan-300">
                      <Icon aria-hidden />
                    </span>
                    <h3 className="mt-5 text-lg">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Project highlights */}
      <section className="bg-canvas-2 py-16 md:py-24">
        <Container className="max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading align="left" eyebrow="Project highlights" title="Our work in" accent="the field" subtitle="Power plants, hospitals, buildings and factories across Bangladesh." />
            <Reveal>
              <Button href="/clients#projects" variant="secondary" className="rounded-full">
                View all projects <FaArrowRight aria-hidden />
              </Button>
            </Reveal>
          </div>
          <div className="mt-12">
            <PosterGallery items={projects.slice(0, 6)} />
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <Container className="max-w-6xl">
          <SectionHeading eyebrow="Meet the team" title="The people behind" accent="your compliance" />
          <div className="mt-12">
            <TeamGrid />
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-canvas-2 py-16 md:py-24">
        <Container className="grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading align="left" eyebrow="FAQ" title="Questions we" accent="hear often" subtitle="Short answers about DOE renewals, water testing and treatment plants." />
            <Reveal delay={100} className="mt-6">
              <Button href="/faq" variant="secondary" className="rounded-full">
                All questions <FaArrowRight aria-hidden />
              </Button>
            </Reveal>
            <Reveal delay={150} className="mt-8 rounded-2xl bg-gradient-to-br from-sky-700 to-cyan-500 p-6 text-white shadow-xl shadow-cyan-500/20">
              <p className="text-lg font-bold">Still have a question?</p>
              <p className="mt-1 text-sm text-sky-50/90">Free consultation — speak to an engineer.</p>
              <a href={telHref(phone)} className="mt-4 inline-flex items-center gap-2 font-bold">
                <FaPhoneAlt aria-hidden /> {phone}
              </a>
            </Reveal>
          </div>
          <Faq items={homeFaqs} />
        </Container>
      </section>

      {/* Articles */}
      <section className="py-16 md:py-24">
        <Container className="max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading align="left" eyebrow="Insights" title="From our" accent="field work" />
            <Reveal>
              <Button href="/blog" variant="secondary" className="rounded-full">
                All articles <FaArrowRight aria-hidden />
              </Button>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal key={a.title} delay={i * 100}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line/10 bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-36 overflow-hidden bg-gradient-to-br from-abyss via-sky-800 to-cyan-600">
                    <Bubbles />
                    <span className="absolute left-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">{a.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg leading-snug">{a.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{a.excerpt}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </div>
  );
}
