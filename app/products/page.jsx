import { siteConfig } from '@/config/site';
import { productPromises, orderSteps } from '@/data/products';
import { listProducts } from '@/server/services/product.service';
import { listCategories } from '@/server/services/category.service';
import { pathTo } from '@/data/product-categories';
import DarkPageHeader from '@/components/ui/DarkPageHeader';
import Container from '@/components/ui/Container';
import Reveal from '@/components/site/Reveal';
import SectionHeading from '@/components/site/SectionHeading';
import ProductCatalog from '@/components/site/ProductCatalog';
import ProductRange from '@/components/site/ProductRange';
import CtaBand from '@/components/site/CtaBand';
import { pageMetadata } from '@/lib/seo';

export const generateMetadata = () =>
  pageMetadata({
    title: 'Products',
    description: `ETP, STP & WTP plants, air blowers and diffusers, flow meters, chemical dosing pumps, analyzers and instruments — supplied, installed and supported in Bangladesh by ${siteConfig.name}.`,
    path: '/products',
  });

export default async function ProductsPage({ searchParams }) {
  const [{ category }, products, categories] = await Promise.all([searchParams, listProducts(), listCategories()]);
  const brands = new Set(products.flatMap((p) => p.brand.split(/,\s*(?!Ltd)/)).filter(Boolean));
  const origins = new Set(products.flatMap((p) => p.origin.split(/,\s*/)).filter(Boolean));
  const initialCategory = categories.some((c) => c.slug === category) ? category : 'all';
  // Every category on the path of a listed product counts as "listed" in the range directory
  const listed = new Set(products.flatMap((p) => pathTo(categories, p.category).map((c) => c.slug)));

  return (
    <div className="bg-canvas">
      <DarkPageHeader
        title="Our"
        accent="Products"
        subtitle="Blowers, diffusers, pumps, dosing systems, meters and analyzers for ETP, STP and WTP — supplied, installed and supported by our engineers."
        breadcrumbs={[{ label: 'Products' }]}
      >
        <ul className="mt-8 flex flex-wrap gap-3">
          {[
            [products.length, 'Products'],
            [categories.length, 'Categories'],
            [brands.size, 'Brands'],
            [origins.size, 'Countries of origin'],
          ].map(([value, label]) => (
            <li key={label} className="glass flex items-baseline gap-2 rounded-2xl px-4 py-2.5">
              <span className="text-xl font-extrabold text-white">{value}</span>
              <span className="text-sm text-sky-100/75">{label}</span>
            </li>
          ))}
        </ul>
      </DarkPageHeader>

      {/* Catalogue */}
      <section id="catalog" className="scroll-mt-28 py-16 md:py-20">
        <Container className="max-w-7xl">
          <SectionHeading eyebrow="Product range" title="Find the right" accent="equipment" className="mb-10" />
          <ProductCatalog key={initialCategory} products={products} categories={categories} initialCategory={initialCategory} />
        </Container>
      </section>

      {/* Full range — every category, including ones without online listings yet */}
      <section id="range" className="scroll-mt-28 border-t border-line/10 py-16 md:py-20">
        <Container className="max-w-7xl">
          <SectionHeading
            eyebrow="Full product range"
            title="Everything we"
            accent="supply"
            subtitle="Pick a category to see its products. A dot means models are listed online — for the rest, ask us for a quotation."
            className="mb-12"
          />
          <ProductRange categories={categories} listed={listed} />
        </Container>
      </section>

      {/* Why buy from us */}
      <section className="bg-canvas-2 py-16 md:py-24">
        <Container className="max-w-7xl">
          <SectionHeading
            eyebrow="Why buy from us"
            title="More than a"
            accent="supplier"
            subtitle="We design treatment plants — so the equipment we supply is chosen to fit the plant, not just the price list."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {productPromises.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 80}>
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

      {/* How ordering works */}
      <section className="py-16 md:py-24">
        <Container className="max-w-6xl">
          <SectionHeading eyebrow="How ordering works" title="From enquiry to" accent="running equipment" />
          <ol className="mt-12 grid gap-5 md:grid-cols-4">
            {orderSteps.map(({ icon: Icon, title, text }, i) => (
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

      <CtaBand title="Not sure which equipment you need?" text="Send us your plant details — our engineers will recommend the right blower, pump or meter." />
    </div>
  );
}
