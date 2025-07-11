import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { getUsageStats, getRecentEvents, getEventStats } from '@/lib/analytics';

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  role?: string;
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser;
    
    // Basic stats available to all authenticated users
    const usageStats = await getUsageStats();
    
    // Admin-only detailed analytics
    if (user?.role === 'admin') {
      const [recentEvents, eventStats] = await Promise.all([
        getRecentEvents(20),
        getEventStats(7),
      ]);
      
      return NextResponse.json({
        usageStats,
        recentEvents,
        eventStats,
        isAdmin: true,
      });
    }
    
    return NextResponse.json({
      usageStats,
      isAdmin: false,
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 