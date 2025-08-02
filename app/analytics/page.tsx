'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AnalyticsDashboard } from '@/components/lazy/LazyComponents';

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin');
    return null;
  }

  const user = session.user as any;
  if (user?.role !== 'admin') {
    router.push('/auth/error?error=AccessDenied');
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <AnalyticsDashboard />
    </div>
  );
}  