import LegalPage from '@/components/layout/LegalPage';
import { legalDocs } from '@/data/legal';
import { pageMetadata } from '@/lib/seo';

export const generateMetadata = () =>
  pageMetadata({
    title: 'Refund Policy',
    description: legalDocs.refundpolicy.summary,
    path: '/legal/refundpolicy',
  });

export default function Page() {
  return <LegalPage docKey="refundpolicy" />;
}
