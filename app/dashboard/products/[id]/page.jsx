import ProductEditor from '@/views/dashboard/content/ProductEditor';

export const metadata = { title: 'Edit product' };

export default async function Page({ params }) {
  const { id } = await params;
  return <ProductEditor id={id} />;
}
