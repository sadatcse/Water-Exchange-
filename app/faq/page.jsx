import { FaPhoneAlt } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { faqGroups } from '@/data/company';
import DarkPageHeader from '@/components/ui/DarkPageHeader';
import Container from '@/components/ui/Container';
import Reveal from '@/components/site/Reveal';
import Faq from '@/components/site/Faq';
import CtaBand, { telHref } from '@/components/site/CtaBand';
import { pageMetadata, faqJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';

export const generateMetadata = () =>
  pageMetadata({
    title: 'FAQ',
    description: `Answers about DOE renewal, water testing, ETP / STP / WTP, EIA / IEE / ECC and captive power plant clearance from ${siteConfig.name}.`,
    path: '/faq',
  });

export default function FaqPage() {
  const phone = siteConfig.contact.phones[0];
  return (
    <div className="bg-canvas">
      <JsonLd data={faqJsonLd(faqGroups.flatMap((g) => g.items))} />
      <DarkPageHeader
        title="Frequently asked"
        accent="questions"
        subtitle="DOE renewals, water testing, treatment plants, environmental clearance and more."
        breadcrumbs={[{ label: 'FAQ' }]}
      />

      <section className="py-16 md:py-24">
        <Container className="grid max-w-6xl gap-10 lg:grid-cols-[16rem_1fr]">
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <nav aria-label="FAQ topics" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
              {faqGroups.map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="flex shrink-0 items-center justify-between gap-3 rounded-xl border border-line/10 bg-surface px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-cyan-500/40 hover:text-sky-700 dark:hover:text-cyan-300"
                >
                  {g.title}
                  <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs text-sky-700 dark:text-cyan-300">{g.items.length}</span>
                </a>
              ))}
            </nav>
            <div className="mt-6 hidden rounded-2xl bg-gradient-to-br from-sky-700 to-cyan-500 p-6 text-white shadow-xl shadow-cyan-500/20 lg:block">
              <p className="font-bold">Free consultation</p>
              <p className="mt-1 text-sm text-sky-50/90">Not sure what applies to you? Ask an engineer.</p>
              <a href={telHref(phone)} className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
                <FaPhoneAlt aria-hidden /> {phone}
              </a>
            </div>
          </aside>

          <div className="space-y-14">
            {faqGroups.map((g) => (
              <section key={g.id} id={g.id} className="scroll-mt-32">
                <Reveal>
                  <h2 className="mb-5 text-2xl font-extrabold">{g.title}</h2>
                </Reveal>
                <Faq items={g.items} openFirst={false} />
              </section>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand title="Have a question we didn’t answer?" text="Call or send a message — we offer free consultations to work out exactly what your facility needs." />
    </div>
  );
}
