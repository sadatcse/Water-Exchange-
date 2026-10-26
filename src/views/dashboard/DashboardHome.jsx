'use client';
import Link from 'next/link';
import {
  FaUsers, FaCalendarDay, FaEnvelope, FaEnvelopeOpen, FaGlobe, FaSignInAlt, FaHistory, FaCog, FaBoxOpen, FaNewspaper, FaUserFriends, FaPlus,
} from 'react-icons/fa';
import useApi from '@/hooks/useApi';
import useAuth from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';
import PageTitle from '@/components/dashboard/PageTitle';
import StatCard, { StatGrid } from '@/components/dashboard/StatCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';

const QUICK_LINKS = [
  { href: '/dashboard/messages', label: 'Read contact requests', icon: FaEnvelope },
  { href: '/dashboard/blog/new', label: 'Write a blog post', icon: FaPlus },
  { href: '/dashboard/products/new', label: 'Add a product', icon: FaBoxOpen },
  { href: '/dashboard/traffic', label: 'See who is visiting the site', icon: FaGlobe },
  { href: '/dashboard/login-history', label: 'Check recent sign-ins', icon: FaSignInAlt },
  { href: '/dashboard/activity', label: 'Review user activity', icon: FaHistory },
  { href: '/dashboard/settings', label: 'Change the site timezone', icon: FaCog },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const stats = useApi('/stats', { select: (res) => res.data });
  const visitors = useApi('/visitor/stats', { select: (res) => res.stats });
  const s = stats.data;

  return (
    <>
      <PageTitle title={`Welcome, ${user?.name?.split(' ')[0] || 'admin'}`} description="Overview of your website." />

      <StatGrid>
        <StatCard label="Total visitors" value={visitors.data?.total} icon={FaUsers} loading={visitors.loading} />
        <StatCard label="Visitors today" value={visitors.data?.today} icon={FaCalendarDay} tone="green" loading={visitors.loading} />
        <StatCard label="Contact messages" value={s?.messages} hint={s ? `${s.unreadMessages} unread` : undefined} icon={FaEnvelope} tone="amber" loading={stats.loading} />
        <StatCard label="Admin accounts" value={s?.users} icon={FaUsers} tone="red" loading={stats.loading} />
      </StatGrid>
      <StatGrid cols={3}>
        <StatCard label="Published products" value={s?.products} icon={FaBoxOpen} tone="gray" loading={stats.loading} />
        <StatCard label="Published blog posts" value={s?.posts} icon={FaNewspaper} tone="gray" loading={stats.loading} />
        <StatCard label="Team members" value={s?.team} icon={FaUserFriends} tone="gray" loading={stats.loading} />
      </StatGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Quick actions">
          <ul className="divide-y divide-line/5">
            {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link href={href} className="flex items-center gap-3 py-3 text-sm font-medium text-body hover:text-primary-600 dark:hover:text-primary-400">
                  <Icon className="text-faint" /> {label}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Latest messages" action={<Button href="/dashboard/messages" variant="ghost" size="sm">All messages</Button>}>
          {s?.recentMessages?.length ? (
            <ul className="divide-y divide-line/5">
              {s.recentMessages.map((m) => (
                <li key={m._id} className="py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-ink">{m.fullName}</p>
                    <span className="shrink-0 text-xs text-subtle">{formatDate(m.createdAt, true)}</span>
                  </div>
                  <a href={`mailto:${m.email}`} className="text-xs text-primary-600 hover:underline dark:text-primary-400">{m.email}</a>
                  {m.subject && <p className="mt-1 text-sm text-body">{m.subject}</p>}
                  <p className="mt-0.5 line-clamp-2 text-sm text-muted">{m.message}</p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={FaEnvelopeOpen} title={stats.loading ? 'Loading…' : 'No messages yet'} description="Messages sent from the Contact page appear here." />
          )}
        </Card>
      </div>
    </>
  );
}
