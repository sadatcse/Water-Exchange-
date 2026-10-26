import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FaArrowRight, FaCheckCircle, FaChevronRight, FaPhoneAlt, FaEnvelope, FaBalanceScale } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { productPromises, quoteHref } from '@/data/products';
import { CategoryIcon } from '@/data/product-categories';
import { getProductBySlug, relatedProducts } from '@/server/services/product.service';
import { imageProps } from '@/lib/images';
import { pageMetadata, productJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Reveal from '@/components/site/Reveal';
import SectionHeading from '@/components/site/SectionHeading';
import Bubbles from '@/components/site/Bubbles';
import WaterWaves from '@/components/site/WaterWaves';
import TiltCard from '@/components/site/TiltCard';
import ProductCard from '@/components/site/ProductCard';
import CtaBand, { telHref } from '@/components/site/CtaBand';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return pageMetadata({
    title: product.name,
    description: `${product.summary} Supplied, installed and supported in Bangladesh by ${siteConfig.name}.`,
    path: `/products/${product.slug}`,
    image: product.image,
  });
}

// "What is a Roots air blower?" → ["What is a", "Roots air blower?"] for the gradient accent
function splitQuestion(question = '') {
  const match = question.match(/^(What (?:is an?|are))\s(.+)$/);
  return match ? [match[1], match[2]] : [question, ''];
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = product.categoryInfo; // { name, slug, path, icon … } or null
  const categoryHref = (slug) => `/products?category=${slug}#catalog`;
  const phone = siteConfig.contact.phones[0];
  const [questionLead, questionAccent] = splitQuestion(product.question || `What is ${product.name}?`);
  const { linked: compareWith, related } = await relatedProducts(product);
  const overview = product.overview.length ? product.overview : [product.summary];
  const specRows = [
    ...product.specs.map((s) => [s.label, s.value]),
    ...(product.brand ? [['Brand', product.brand]] : []),
    ...(product.origin ? [['Origin', product.origin]] : []),
  ];
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    ...(category?.path || []).map((c) => ({ label: c.name, href: categoryHref(c.slug) })),
    { label: product.name },
  ];

  return (
    <div className="bg-canvas">
      <JsonLd
        data={[
          productJsonLd(product, category?.path.map((c) => c.name).join(' > ')),
          breadcrumbJsonLd([
            { name: 'Products', path: '/products' },
            ...(category?.path || []).map((c) => ({ name: c.name, path: `/products?category=${c.slug}` })),
            { name: product.name, path: `/products/${product.slug}` },
          ]),
        ]}
      />
      {/* Product hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-abyss via-abyss-2 to-sky-800 text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(34,211,238,0.30),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" aria-hidden />
        <Bubbles />
        <Container className="relative grid max-w-7xl items-center gap-14 pb-32 pt-10 md:pb-40 md:pt-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-sky-100/70">
              {crumbs.map((crumb, i) => (
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
            {category && (
              <Reveal delay={50}>
                <Link
                  href={categoryHref(category.slug)}
                  className="mt-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200 transition-colors hover:bg-cyan-300/20"
                >
                  <CategoryIcon name={category.icon} /> {category.name}
                </Link>
              </Reveal>
            )}
            <Reveal delay={100}>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl">{product.name}</h1>
              <span className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-cyan-400 to-sky-300" />
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-sky-100/80">{product.summary}</p>
            </Reveal>
            <Reveal delay={200} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href={quoteHref(product)} variant="white" size="lg" className="rounded-full">
                Request a quotation <FaArrowRight aria-hidden />
              </Button>
              <Button href={telHref(phone)} variant="glass" size="lg" className="rounded-full">
                <FaPhoneAlt aria-hidden /> {phone}
              </Button>
            </Reveal>
            <Reveal delay={300}>
              <dl className="mt-10 grid gap-3 sm:grid-cols-3">
                {product.highlights.map((h) => (
                  <div key={h.label} className="glass flex items-baseline justify-between gap-3 rounded-2xl px-4 py-3 sm:block sm:py-4">
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-cyan-200">{h.label}</dt>
                    <dd className="text-base font-extrabold text-white sm:mt-1">{h.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={150} className="[perspective:1400px]">
            <TiltCard max={7} className="relative mx-auto w-full max-w-lg lg:max-w-xl">
              <div className="pointer-events-none absolute -inset-8 animate-spin-slow rounded-full border border-dashed border-cyan-300/25" aria-hidden />
              <div className="pointer-events-none absolute inset-8 rounded-full bg-cyan-400/25 blur-3xl" aria-hidden />
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-[#eceef0] shadow-2xl shadow-black/40 ring-1 ring-white/40">
                <Image
                  src={product.image}
                  alt={product.name}
                  {...imageProps(product.image)}
                  fill
                  sizes="(min-width: 1024px) 576px, 90vw"
                  loading="eager"
                  fetchPriority="high"
                  className="object-cover"
                />
              </div>
              <div className="absolute -right-3 -top-5 max-w-[15rem] animate-float rounded-2xl bg-white px-4 py-3 text-sky-900 shadow-xl md:-right-8" style={{ transform: 'translateZ(60px)' }}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Brand</p>
                <p className="text-sm font-extrabold leading-snug">{product.brand}</p>
              </div>
              <div className="absolute -bottom-6 -left-3 animate-float rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 px-4 py-3 text-white shadow-xl [animation-delay:1.5s] md:-left-8">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-100">Origin</p>
                <p className="text-sm font-extrabold">{product.origin}</p>
              </div>
            </TiltCard>
          </Reveal>
        </Container>
        <WaterWaves />
      </header>

      {/* Overview */}
      <section className="py-16 md:py-24">
        <Container className="grid max-w-7xl gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          <div>
            <SectionHeading align="left" eyebrow="Product overview" title={questionLead} accent={questionAccent} />
            <Reveal delay={100} className="mt-6 space-y-4 leading-relaxed">
              {overview.map((text, i) => (
                <p key={i} className={i === 0 ? 'text-lg text-ink-2' : 'text-muted'}>{text}</p>
              ))}
            </Reveal>
            {(product.distinction.text || compareWith.length > 0) && (
            <Reveal delay={150} className="mt-8 flex gap-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-700 to-cyan-500 text-white shadow-lg shadow-cyan-500/25">
                <FaBalanceScale aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700 dark:text-cyan-300">Don’t confuse it with</p>
                {product.distinction.text && <p className="mt-2 text-sm leading-relaxed text-body">{product.distinction.text}</p>}
                {compareWith.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {compareWith.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/products/${p.slug}`}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-line/15 bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:border-cyan-500/60 hover:text-sky-700 dark:hover:text-cyan-300"
                      >
                        {p.name} <FaArrowRight className="text-[10px] text-cyan-500 transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
            )}
          </div>

          <aside className="space-y-6">
            <Reveal delay={100} className="rounded-3xl border border-line/10 bg-surface p-7 shadow-sm">
              <h2 className="text-xl font-bold">Key features</h2>
              <ul className="mt-5 space-y-3.5">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm font-medium text-body">
                    <FaCheckCircle className="mt-0.5 shrink-0 text-cyan-500" aria-hidden /> {f}
                  </li>
                ))}
                <li className="flex items-start gap-3 text-sm font-medium text-body">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-cyan-500" aria-hidden /> Installation and after-sales support in Bangladesh
                </li>
              </ul>
            </Reveal>
            {product.applications.length > 0 && (
            <Reveal delay={200} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-abyss via-sky-800 to-cyan-600 p-7 text-white shadow-xl shadow-sky-900/20">
              <Bubbles />
              <div className="relative">
                <h2 className="text-xl font-bold text-white">Where it’s used</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {product.applications.map((a) => (
                    <li key={a} className="glass rounded-full px-3.5 py-1.5 text-sm font-semibold text-white">{a}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
            )}
          </aside>
        </Container>
      </section>

      {/* Specifications */}
      <section id="specifications" className="scroll-mt-28 bg-canvas-2 py-16 md:py-24">
        <Container className="max-w-7xl">
          <SectionHeading
            eyebrow="Specifications"
            title={product.name}
            accent="specifications"
            subtitle="Ranges cover the full series — we confirm the exact model, rating and datasheet for your plant."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <Reveal className="self-start overflow-hidden rounded-3xl border border-line/10 bg-surface shadow-xl shadow-sky-900/5">
              <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-abyss via-sky-900 to-sky-700 px-6 py-4 text-white">
                <p className="font-bold">Technical data</p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-100">{specRows.length} parameters</span>
              </div>
              <dl className="divide-y divide-line/10">
                {specRows.map(([label, value]) => (
                  <div key={label} className="grid gap-1 px-6 py-4 transition-colors hover:bg-cyan-500/5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                    <dt className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.12em] text-sky-700 dark:text-cyan-300">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-500" aria-hidden /> {label}
                    </dt>
                    <dd className="text-sm font-medium text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <div className="space-y-6 lg:sticky lg:top-32 lg:self-start">
              <Reveal delay={100} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 to-cyan-500 p-7 text-white shadow-xl shadow-cyan-500/20">
                <Bubbles />
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-100">Get a quotation</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-white">Need the right size for your plant?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sky-50/90">
                    Send us your flow, load or line size — an engineer will confirm the model and send a price with the datasheet.
                  </p>
                  <Button href={quoteHref(product)} variant="white" className="mt-6 w-full rounded-full">
                    Request a quotation <FaArrowRight aria-hidden />
                  </Button>
                  <div className="mt-5 space-y-2 text-sm">
                    <a href={telHref(phone)} className="flex items-center gap-2 font-semibold hover:underline">
                      <FaPhoneAlt aria-hidden /> {phone}
                    </a>
                    <a href={`mailto:${siteConfig.contact.email}`} className="flex items-center gap-2 break-all font-semibold hover:underline">
                      <FaEnvelope aria-hidden /> {siteConfig.contact.email}
                    </a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={200} className="rounded-3xl border border-line/10 bg-surface p-6">
                <ul className="space-y-5">
                  {productPromises.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-sky-700 dark:text-cyan-300">
                        <Icon aria-hidden />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-ink">{title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted">{text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Related products */}
      <section className="py-16 md:py-24">
        <Container className="max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading align="left" eyebrow="Related products" title="Compare and" accent="combine" />
            <Reveal>
              <Button href="/products" variant="secondary" className="rounded-full">
                All products <FaArrowRight aria-hidden />
              </Button>
            </Reveal>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 100}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand title="Ready for a quotation?" text={`Tell us about your plant — we’ll size the right ${product.name.toLowerCase()} and send a price with the datasheet.`} />
    </div>
  );
}
