import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingFallback = ({ height = "400px" }: { height?: string }) => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className={`w-full`} style={{ height }} />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const DashboardLoadingFallback = () => (
  <div className="space-y-6 p-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
    <Skeleton className="h-96 w-full" />
  </div>
);

export const LazyAnalyticsDashboard = React.lazy(() => import('@/components/analytics-dashboard'));
export const LazyDashboard = React.lazy(() => import('@/components/dashboard'));
export const LazyUserProfile = React.lazy(() => import('@/components/user-profile'));
export const LazyCollaborativeEditor = React.lazy(() => import('@/components/collaborative-editor'));
export const LazyCodeEditor = React.lazy(() => import('@/components/code-editor'));
export const LazyProjectManagement = React.lazy(() => import('@/components/project/project-management'));
export const LazyTeamWorkspace = React.lazy(() => import('@/components/team-workspace'));
export const LazyKnowledgeBase = React.lazy(() => import('@/components/knowledge-base'));

export const AnalyticsDashboard = (props: any) => (
  <Suspense fallback={<DashboardLoadingFallback />}>
    <LazyAnalyticsDashboard {...props} />
  </Suspense>
);

export const Dashboard = (props: any) => (
  <Suspense fallback={<DashboardLoadingFallback />}>
    <LazyDashboard {...props} />
  </Suspense>
);

export const UserProfile = (props: any) => (
  <Suspense fallback={<LoadingFallback height="300px" />}>
    <LazyUserProfile {...props} />
  </Suspense>
);

export const CollaborativeEditor = (props: any) => (
  <Suspense fallback={<LoadingFallback height="500px" />}>
    <LazyCollaborativeEditor {...props} />
  </Suspense>
);

export const CodeEditor = (props: any) => (
  <Suspense fallback={<LoadingFallback height="400px" />}>
    <LazyCodeEditor {...props} />
  </Suspense>
);

export const ProjectManagement = (props: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <LazyProjectManagement {...props} />
  </Suspense>
);

export const TeamWorkspace = (props: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <LazyTeamWorkspace {...props} />
  </Suspense>
);

export const KnowledgeBase = (props: any) => (
  <Suspense fallback={<LoadingFallback />}>
    <LazyKnowledgeBase {...props} />
  </Suspense>
);
