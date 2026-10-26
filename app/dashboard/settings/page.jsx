import { Suspense } from 'react';
import SettingsView from '@/views/dashboard/SettingsView';
import { FormSkeleton } from '@/components/loading/PageSkeletons';

export const metadata = { title: 'Settings' };

export default function Page() {
  return (
    <Suspense fallback={<FormSkeleton cards={2} />}>
      <SettingsView />
    </Suspense>
  );
}
