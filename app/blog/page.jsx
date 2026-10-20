import { siteConfig } from '@/config/site';
import { articles } from '@/data/company';
import DarkPageHeader from '@/components/ui/DarkPageHeader';
import Container from '@/components/ui/Container';
import Reveal from '@/components/site/Reveal';
import Bubbles from '@/components/site/Bubbles';
import CtaBand from '@/components/site/CtaBand';

export const metadata = {
  title: 'Blog',
  description: `Research, events and evaluations from ${siteConfig.name} — plastic waste, solid waste management and more.`,
};

export default function BlogPage() {
  const [featured, ...rest] = articles;
  return (
    <div className="bg-canvas">
      <DarkPageHeader title="Know" accent="Us" subtitle="Research, events and evaluations from our field work." breadcrumbs={[{ label: 'Blog' }]} />

      <section className="py-16 md:py-24">
        <Container className="max-w-6xl">
          <Reveal>
            <article className="grid overflow-hidden rounded-3xl border border-line/10 bg-surface shadow-xl shadow-sky-900/5 md:grid-cols-2">
              <div className="relative min-h-[14rem] overflow-hidden bg-gradient-to-br from-abyss via-sky-800 to-cyan-600">
                <Bubbles />
                <span className="absolute left-6 top-6 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white backdrop-blur">Featured · {featured.category}</span>
              </div>
              <div className="p-8 md:p-10">
                <h2 className="text-2xl font-extrabold leading-snug">{featured.title}</h2>
                <p className="mt-4 leading-relaxed text-muted">{featured.excerpt}</p>
              </div>
            </article>
          </Reveal>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {rest.map((a, i) => (
              <Reveal key={a.title} delay={i * 100}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line/10 bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-500">
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
