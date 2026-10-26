import LegalPage from '@/components/layout/LegalPage';
import { legalDocs } from '@/data/legal';
import { pageMetadata } from '@/lib/seo';

export const generateMetadata = () =>
  pageMetadata({
    title: 'Terms of Use',
    description: legalDocs.termsofuse.summary,
    path: '/legal/termsofuse',
  });

export default function Page() {
  return <LegalPage docKey="termsofuse" />;
}
