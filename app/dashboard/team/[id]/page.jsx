import TeamEditor from '@/views/dashboard/content/TeamEditor';

export const metadata = { title: 'Edit team member' };

export default async function Page({ params }) {
  const { id } = await params;
  return <TeamEditor id={id} />;
}
