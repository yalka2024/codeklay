import { AuditLogViewer } from './audit-log-viewer';

export function EnterpriseDashboard() {
  return (
    <div>
      {/* ... existing dashboard content ... */}
      <section style={{ marginTop: 48 }}>
        <h1>Audit Logs</h1>
        <AuditLogViewer />
      </section>
    </div>
  );
} 