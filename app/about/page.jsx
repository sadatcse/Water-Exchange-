import Image from 'next/image';
import { FaCheckCircle, FaQuoteLeft } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { whyChooseUs, mission, vision, ceoMessage, facts, promises } from '@/data/company';
import DarkPageHeader from '@/components/ui/DarkPageHeader';
import Container from '@/components/ui/Container';
import Reveal from '@/components/site/Reveal';
import SectionHeading from '@/components/site/SectionHeading';
import TiltCard from '@/components/site/TiltCard';
import CountUp from '@/components/site/CountUp';
import Bubbles from '@/components/site/Bubbles';
import TeamGrid from '@/components/site/TeamGrid';
import CtaBand from '@/components/site/CtaBand';

export const metadata = {
  title: 'About',
  description: `Who we are — mission, vision, CEO’s message and team of ${siteConfig.name}, an environment consultancy in Dhaka, Bangladesh.`,
};

export default function AboutPage() {
  return (
    <div className="bg-canvas">
      <DarkPageHeader title="About" accent={siteConfig.name} subtitle={siteConfig.description} breadcrumbs={[{ label: 'About' }]} />

      {/* Story */}
      <section className="py-16 md:py-24">
        <Container className="grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Our story" title="Water &" accent="beyond" />
            <Reveal delay={100} className="mt-6 space-y-4 leading-relaxed text-body">
              <p>
                {siteConfig.name} is an environment consultancy based in New DOHS Mohakhali, Dhaka. We help industries and hospitals stay
                compliant — yearly water tests and paper renewals, environment reports, ETP / STP / WTP design and drawings, treatment
                chemicals and machinery, and clearance for captive power plants.
              </p>
              <p className="font-bangla text-lg text-ink">
                ETP, STP, WTP ডিজাইন, Installation এবং পরিবেশ অধিদপ্তরের (DOE) Water Test ও ছাড়পত্র বিষয়ক পরামর্শদাতা শুরু থেকে শেষ পর্যন্ত।
              </p>
              <p>Beyond water, we work on e-waste, research, GIS, EIA, landfill and carbon credit projects — including studies for development partners.</p>
            </Reveal>
            <Reveal delay={200}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[...promises, ...whyChooseUs].map((w) => (
                  <li key={w.title} className="flex items-start gap-2 font-semibold text-ink">
                    <FaCheckCircle className="mt-1 shrink-0 text-cyan-500" aria-hidden /> {w.title}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={150} className="[perspective:1200px]">
            <TiltCard max={8} className="relative mx-auto max-w-md">
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-sky-500/30 to-cyan-400/30 blur-2xl" aria-hidden />
              <Image
                src="/images/projects/high-end-consultancy.webp"
                alt="The high-end environment consultancy firm in Bangladesh"
                width={540}
                height={540}
                className="relative rounded-[2rem] border-4 border-white shadow-2xl dark:border-surface"
              />
            </TiltCard>
          </Reveal>
        </Container>
      </section>

      {/* Facts */}
      <section className="pb-16 md:pb-24">
        <Container className="max-w-6xl">
          <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line/10 bg-line/10 shadow-xl shadow-sky-900/5 md:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-surface p-6 text-center md:p-8">
                <p className="text-brand text-4xl font-extrabold md:text-5xl">
                  <CountUp value={f.value} suffix={f.suffix} />
                </p>
                <p className="mt-2 text-sm font-semibold text-muted">{f.label}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Mission & vision */}
      <section className="bg-canvas-2 py-16 md:py-24">
        <Container className="max-w-6xl">
          <SectionHeading eyebrow="What drives us" title="Mission &" accent="vision" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[mission, vision].map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 120} className="group rounded-3xl border border-line/10 bg-surface p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 md:p-10">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-700 to-cyan-500 text-xl text-white shadow-lg shadow-cyan-500/25 transition-transform group-hover:rotate-6">
                  <Icon aria-hidden />
                </span>
                <h3 className="mt-6 text-2xl">{title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-muted">{text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CEO's message */}
      <section className="py-16 md:py-24">
        <Container className="max-w-5xl">
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-abyss via-sky-800 to-cyan-600 p-8 text-white shadow-2xl shadow-sky-900/25 md:p-14">
            <Bubbles />
            <div className="relative grid items-center gap-10 md:grid-cols-[1fr_14rem]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">CEO’s message</p>
                <FaQuoteLeft className="mt-6 text-4xl text-cyan-300" aria-hidden />
                <blockquote className="mt-4">
                  <p className="text-3xl font-extrabold leading-tight text-white md:text-4xl">{ceoMessage.headline}</p>
                  <p className="mt-5 text-lg leading-relaxed text-sky-100/85">{ceoMessage.text}</p>
                </blockquote>
                <p className="mt-8 font-bold text-white">{siteConfig.founder.name}</p>
                <p className="text-sm text-sky-100/75">
                  {siteConfig.founder.title} · {siteConfig.founder.credentials}
                </p>
              </div>
              <Image src="/brand/wx-light.svg" alt="" width={319} height={237} unoptimized className="mx-auto hidden w-full max-w-[14rem] animate-float md:block" />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Team */}
      <section className="bg-canvas-2 py-16 md:py-24">
        <Container className="max-w-6xl">
          <SectionHeading eyebrow="Meet the team" title="The people behind" accent="your compliance" />
          <div className="mt-12">
            <TeamGrid />
          </div>
        </Container>
      </section>

      <CtaBand title="Want to work with us?" text="Tell us about your facility — we’ll suggest the right solution and take care of the compliance." />
    </div>
  );
}
