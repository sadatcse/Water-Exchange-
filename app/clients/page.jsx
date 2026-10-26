import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { partners, industries, projects, facts } from '@/data/company';
import { listClients } from '@/server/services/client.service';
import { imageProps } from '@/lib/images';
import DarkPageHeader from '@/components/ui/DarkPageHeader';
import Container from '@/components/ui/Container';
import Reveal from '@/components/site/Reveal';
import SectionHeading from '@/components/site/SectionHeading';
import TiltCard from '@/components/site/TiltCard';
import CountUp from '@/components/site/CountUp';
import PosterGallery from '@/components/site/PosterGallery';
import CtaBand from '@/components/site/CtaBand';
import { pageMetadata } from '@/lib/seo';

export const generateMetadata = () =>
  pageMetadata({
    title: 'Clients',
    description: `Factories, hospitals, power plants and development partners served by ${siteConfig.name}.`,
    path: '/clients',
  });

function LogoCard({ name, logo, sector }) {
  return (
    <TiltCard max={12} className="h-full">
      <div className="group flex h-full flex-col items-center justify-center rounded-3xl border border-line/10 bg-surface p-5 text-center shadow-sm transition-shadow hover:shadow-2xl hover:shadow-cyan-500/10">
        <div className="flex h-24 w-full items-center justify-center rounded-2xl bg-white p-3">
          <Image src={logo} alt={name || 'Client logo'} {...imageProps(logo)} width={180} height={96} className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
        </div>
        {name && <h3 className="mt-4 text-sm font-bold">{name}</h3>}
        <p className="mt-0.5 text-xs text-subtle">{sector}</p>
      </div>
    </TiltCard>
  );
}

export default async function ClientsPage() {
  const clients = await listClients();
  return (
    <div className="bg-canvas">
      <DarkPageHeader
        title="Clients"
        accent="Served"
        subtitle="200+ corporate companies and hospitals — plus leading development partners — trust us with their water, waste and compliance."
        breadcrumbs={[{ label: 'Clients' }]}
      />

      {/* Numbers */}
      <section className="relative z-10 -mt-16 md:-mt-20">
        <Container className="max-w-6xl">
          <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line/10 bg-line/10 shadow-xl shadow-sky-900/10 md:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="bg-surface p-6 text-center">
                <p className="text-brand text-4xl font-extrabold">
                  <CountUp value={f.value} suffix={f.suffix} />
                </p>
                <p className="mt-1 text-sm font-semibold text-muted">{f.label}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="max-w-7xl">
          <SectionHeading eyebrow="Our happy clients" title="Industry &" accent="healthcare" />
          <div className="mt-12 grid grid-cols-2 gap-4 [perspective:1200px] sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {clients.map((c, i) => (
              <Reveal key={c._id} delay={(i % 4) * 80}>
                <LogoCard {...c} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-canvas-2 py-16 md:py-24">
        <Container className="max-w-7xl">
          <SectionHeading eyebrow="Research & evaluation" title="Development" accent="partners" subtitle="Baseline surveys, seminars and project evaluations with leading organisations." />
          <div className="mt-12 grid grid-cols-2 gap-4 [perspective:1200px] sm:grid-cols-3 md:gap-6 lg:grid-cols-5">
            {partners.map((p, i) => (
              <Reveal key={p.logo} delay={i * 80}>
                <LogoCard {...p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="projects" className="scroll-mt-28 py-16 md:py-24">
        <Container className="max-w-7xl">
          <SectionHeading eyebrow="Project highlights" title="Our work in" accent="the field" subtitle="Tap a project to view it full size." />
          <div className="mt-12">
            <PosterGallery items={projects} />
          </div>
        </Container>
      </section>

      <section className="bg-canvas-2 py-16 md:py-24">
        <Container className="max-w-7xl">
          <SectionHeading eyebrow="Who we help" title="Industries we" accent="serve" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 80} className="rounded-2xl border border-line/10 bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-xl text-sky-700 dark:text-cyan-300">
                  <Icon aria-hidden />
                </span>
                <h3 className="mt-5 text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand title="Become our next success story" />
    </div>
  );
}
