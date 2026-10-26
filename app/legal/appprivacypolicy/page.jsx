import LegalPage from '@/components/layout/LegalPage';
import { legalDocs } from '@/data/legal';
import { pageMetadata } from '@/lib/seo';

export const generateMetadata = () =>
  pageMetadata({
    title: 'Privacy Policy',
    description: legalDocs.appprivacypolicy.summary,
    path: '/legal/appprivacypolicy',
  });

export default function Page() {
  return <LegalPage docKey="appprivacypolicy" />;
}
