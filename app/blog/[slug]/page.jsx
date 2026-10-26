import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaArrowRight, FaChevronRight, FaPhoneAlt, FaRegClock, FaRegCalendarAlt, FaUserEdit } from 'react-icons/fa';
import { siteConfig } from '@/config/site';
import { getPostBySlug, relatedPosts } from '@/server/services/blog.service';
import { imageProps } from '@/lib/images';
import { pageMetadata, articleJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import JsonLd from '@/components/seo/JsonLd';
import { formatDate } from '@/lib/utils';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Reveal from '@/components/site/Reveal';
import SectionHeading from '@/components/site/SectionHeading';
import ArticleBody from '@/components/site/ArticleBody';
import BlogCard from '@/components/site/BlogCard';
import CtaBand, { telHref } from '@/components/site/CtaBand';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    type: 'article',
    extra: { publishedTime: post.publishedAt, modifiedTime: post.updatedAt, section: post.category, tags: post.tags },
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await relatedPosts(post);
  const phone = siteConfig.contact.phones[0];
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blog' }, { label: post.category, href: `/blog?category=${encodeURIComponent(post.category)}` }];

  return (
    <div className="bg-canvas">
      <JsonLd
        data={[
          articleJsonLd(post),
          breadcrumbJsonLd([{ name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]),
        ]}
      />
      {/* Cover */}
      <header className="relative isolate overflow-hidden bg-abyss text-white">
        <Image src={post.coverImage} alt="" {...imageProps(post.coverImage)} fill loading="eager" fetchPriority="high" sizes="100vw" className="-z-10 object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-abyss via-abyss/75 to-abyss/30" aria-hidden />
        <Container className="max-w-4xl pb-16 pt-14 md:pb-24 md:pt-24">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-sky-100/75">
            {crumbs.map((crumb, i) => (
              <Fragment key={crumb.label}>
                {i > 0 && <FaChevronRight className="text-[9px]" aria-hidden />}
                <Link href={crumb.href} className="hover:text-cyan-300">{crumb.label}</Link>
              </Fragment>
            ))}
          </nav>
          <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">{post.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-sky-100/85">{post.excerpt}</p>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-sky-100/80">
            <li className="flex items-center gap-2"><FaUserEdit className="text-cyan-300" aria-hidden /> {post.author}</li>
            <li className="flex items-center gap-2">
              <FaRegCalendarAlt className="text-cyan-300" aria-hidden /> <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </li>
            <li className="flex items-center gap-2"><FaRegClock className="text-cyan-300" aria-hidden /> {post.readMinutes} min read</li>
          </ul>
        </Container>
      </header>

      {/* Article + sidebar */}
      <section className="py-14 md:py-20">
        <Container className="grid max-w-6xl gap-12 lg:grid-cols-[1fr_18rem]">
          <article className="min-w-0">
            <ArticleBody content={post.content} />
            {post.tags.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2 border-t border-line/10 pt-6" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li key={tag} className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-cyan-300">#{tag}</li>
                ))}
              </ul>
            )}
            <Link href="/blog" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:gap-3 dark:text-cyan-300">
              <FaArrowLeft aria-hidden /> Back to all articles
            </Link>
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-gradient-to-br from-sky-700 to-cyan-500 p-6 text-white shadow-xl shadow-cyan-500/20">
              <p className="text-lg font-bold">Need help with this?</p>
              <p className="mt-2 text-sm text-sky-50/90">Talk to our engineers about your plant, clearance or water test — the first consultation is free.</p>
              <Button href="/contact#contact-form" variant="white" className="mt-5 w-full rounded-full">
                Get in touch <FaArrowRight aria-hidden />
              </Button>
              <a href={telHref(phone)} className="mt-4 flex items-center justify-center gap-2 text-sm font-bold">
                <FaPhoneAlt aria-hidden /> {phone}
              </a>
            </div>
          </aside>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-canvas-2 py-16 md:py-20">
          <Container className="max-w-7xl">
            <SectionHeading align="left" eyebrow="Keep reading" title="Related" accent="articles" />
            <ul className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 100}>
                  <BlogCard post={p} />
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CtaBand />
    </div>
  );
}
