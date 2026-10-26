import BlogEditor from '@/views/dashboard/content/BlogEditor';

export const metadata = { title: 'Edit post' };

export default async function Page({ params }) {
  const { id } = await params;
  return <BlogEditor id={id} />;
}
