import { FaArrowRight } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { expertise, specialties, whatWeDo } from '@/data/company';
import DarkPageHeader from '@/components/ui/DarkPageHeader';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Reveal from '@/components/site/Reveal';
import SectionHeading from '@/components/site/SectionHeading';
import Bubbles from '@/components/site/Bubbles';
import TiltCard from '@/components/site/TiltCard';
import CtaBand from '@/components/site/CtaBand';
import { pageMetadata } from '@/lib/seo';

export const generateMetadata = () =>
  pageMetadata({
    title: 'Expertise',
    description: `Environmental assessment, waste management, water & sanitation, research and GIS expertise at ${siteConfig.name}.`,
    path: '/expertise',
  });

export default function ExpertisePage() {
  return (
    <div className="bg-canvas">
      <DarkPageHeader
        title="Our"
        accent="Expertise"
        subtitle="Our team of environmental professionals delivers expert solutions for sustainable development, regulatory compliance and environmental management projects."
        breadcrumbs={[{ label: 'Expertise' }]}
      />

      {/* Our expertise */}
      <section className="py-16 md:py-24">
        <Container className="max-w-7xl">
          <SectionHeading eyebrow="Our expertise" title="Eight areas of" accent="deep expertise" />
          <div className="mt-12 grid gap-5 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-4">
            {expertise.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={(i % 4) * 80}>
                <TiltCard max={8} className="h-full">
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-line/10 bg-surface p-6 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10">
                    <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-sky-700 to-cyan-500 transition-transform duration-500 group-hover:scale-x-100" aria-hidden />
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-700 to-cyan-500 text-xl text-white shadow-lg shadow-cyan-500/25">
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

      {/* Specialist areas — timeline */}
      <section className="bg-canvas-2 py-16 md:py-24">
        <Container className="max-w-6xl">
          <SectionHeading eyebrow="We are" title="Specialists in" accent="six fields" />
          <div className="relative mt-14">
            <div className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/40 to-cyan-500/0 md:left-1/2" aria-hidden />
            <ol className="space-y-8 md:space-y-12">
              {specialties.map(({ icon: Icon, title, text }, i) => (
                <Reveal as="li" key={title} delay={80} className="relative grid items-center gap-6 pl-16 md:grid-cols-2 md:pl-0">
                  <span className="absolute left-6 top-6 flex h-12 w-12 -translate-x-1/2 rotate-45 items-center justify-center rounded-xl border border-cyan-500/30 bg-surface shadow-lg md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                    <Icon className="-rotate-45 text-sky-700 dark:text-cyan-300" aria-hidden />
                  </span>
                  <div className={i % 2 ? 'md:col-start-2 md:pl-14' : 'md:pr-14 md:text-right'}>
                    <div className="rounded-2xl border border-line/10 bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-xl">
                      <h3 className="text-lg">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* What we do */}
      <section className="relative overflow-hidden bg-gradient-to-br from-abyss via-abyss-2 to-sky-900 py-16 text-white md:py-24">
        <Bubbles />
        <Container className="relative max-w-6xl">
          <SectionHeading
            onDark
            eyebrow="What we do"
            title="Assessment, waste &"
            accent="water design"
            subtitle="Comprehensive environmental services — from impact assessments to sustainable solutions — with regulatory compliance in every project."
          />
          <div className="mt-12 grid gap-6 [perspective:1200px] md:grid-cols-3">
            {whatWeDo.map(({ title, text }, i) => (
              <Reveal key={title} delay={i * 120}>
                <TiltCard max={10} className="h-full">
                  <div className="glass h-full rounded-3xl p-7">
                    <span className="text-4xl font-extrabold text-cyan-300/40">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-3 text-xl text-white">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-sky-100/75">{text}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Button href="/services" variant="white" size="lg" className="rounded-full">
              Our services <FaArrowRight aria-hidden />
            </Button>
          </Reveal>
        </Container>
      </section>

      {/* Our story */}
      <section className="py-16 md:py-24">
        <Container className="max-w-4xl text-center">
          <SectionHeading eyebrow="Our story" title="Built on trust and" accent="quality work" />
          <Reveal delay={100}>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              We built our reputation on trust, quality workmanship and service. Our team of environmental professionals is committed to
              compliant, sustainable and practical solutions that meet the needs of industries, communities and regulatory bodies.
            </p>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </div>
  );
}
