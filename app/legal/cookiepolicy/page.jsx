import LegalPage from '@/components/layout/LegalPage';
import { legalDocs } from '@/data/legal';
import { pageMetadata } from '@/lib/seo';

export const generateMetadata = () =>
  pageMetadata({
    title: 'Cookie Policy',
    description: legalDocs.cookiepolicy.summary,
    path: '/legal/cookiepolicy',
  });

export default function Page() {
  return <LegalPage docKey="cookiepolicy" />;
}
