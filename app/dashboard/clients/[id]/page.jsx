import ClientEditor from '@/views/dashboard/content/ClientEditor';

export const metadata = { title: 'Edit client' };

export default async function Page({ params }) {
  const { id } = await params;
  return <ClientEditor id={id} />;
}
