import { NextResponse } from 'next/server';
import VisitorLog from '@/models/VisitorLog';
import { requireAdmin, unauthorizedResponse } from '@/lib/auth-guard';

export const dynamic = 'force-dynamic';

const SINCE = '`createdAt` >= ?';

// Admin: full analytics for Dashboard › Traffic Analytics
export async function GET(req) {
  if (!requireAdmin(req)) return unauthorizedResponse();
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const [today, total, online, yesterday, month, year, sourceBreakdown, recent, countries] = await Promise.all([
      VisitorLog.count(SINCE, [startOfToday]),
      VisitorLog.count(),
      VisitorLog.count(SINCE, [fiveMinutesAgo]),
      VisitorLog.count('`createdAt` >= ? AND `createdAt` < ?', [startOfYesterday, startOfToday]),
      VisitorLog.count(SINCE, [startOfMonth]),
      VisitorLog.count(SINCE, [startOfYear]),
      VisitorLog.countBy('source'),
      VisitorLog.find({ orderBy: { createdAt: -1 }, limit: 300 }),
      VisitorLog.countBy('country'), // most visits first
    ]);

    const countFor = (name) => sourceBreakdown.find((s) => s._id === name)?.count || 0;

    return NextResponse.json({
      success: true,
      stats: {
        today,
        total,
        online: Math.max(1, online),
        yesterday,
        month,
        year,
        sources: { direct: countFor('Direct'), searchEngine: countFor('Search Engine'), referral: countFor('Referral') },
        recent,
        countries: countries.slice(0, 8).map((c) => ({ name: c._id, count: c.count })),
      },
    });
  } catch (error) {
    console.error('Visitor stats error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
