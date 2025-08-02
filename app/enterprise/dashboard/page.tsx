import React, { Suspense } from "react";
const EnterpriseDashboard = React.lazy(() => import("@/components/enterprise/enterprise-dashboard"));

export default function EnterpriseDashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <EnterpriseDashboard />
    </Suspense>
  );
} 