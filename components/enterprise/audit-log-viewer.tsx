import React, { useEffect, useState } from 'react';

type AuditLog = {
  id?: string;
  user_id?: string;
  resource_id?: string;
  details?: {
    old_role?: string;
    new_role?: string;
    changed_by?: string;
  };
  created_at?: string;
  user?: { id: string; email: string };
};

type Filters = {
  changedBy?: string;
  changedUser?: string;
  oldRole?: string;
  newRole?: string;
  fromDate?: string;
  toDate?: string;
};

export function AuditLogViewer() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          ...filters,
          page: String(page),
        } as any);
        const res = await fetch(`/api/admin/audit-logs?${params}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load logs');
        setLogs(data.logs);
        setHasNext(data.hasNext || false);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [filters, page]);

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
    setPage(0);
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2>Audit Log: Role Changes</h2>
      <div style={{ marginBottom: 16 }}>
        <input name="changedBy" placeholder="Changed By (User ID)" value={filters.changedBy || ''} onChange={handleFilterChange} style={{ marginRight: 8 }} />
        <input name="changedUser" placeholder="Changed User (User ID)" value={filters.changedUser || ''} onChange={handleFilterChange} style={{ marginRight: 8 }} />
        <select name="oldRole" value={filters.oldRole || ''} onChange={handleFilterChange} style={{ marginRight: 8 }}>
          <option value="">Old Role</option>
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="owner">owner</option>
          <option value="auditor">auditor</option>
        </select>
        <select name="newRole" value={filters.newRole || ''} onChange={handleFilterChange} style={{ marginRight: 8 }}>
          <option value="">New Role</option>
          <option value="user">user</option>
          <option value="admin">admin</option>
          <option value="owner">owner</option>
          <option value="auditor">auditor</option>
        </select>
        <input name="fromDate" type="date" value={filters.fromDate || ''} onChange={handleFilterChange} style={{ marginRight: 8 }} />
        <input name="toDate" type="date" value={filters.toDate || ''} onChange={handleFilterChange} />
      </div>
      {loading ? <p>Loading logs...</p> : null}
      {error ? <p style={{ color: 'red' }}>{error}</p> : null}
      <table style={{ width: '100%', marginBottom: 24 }}>
        <thead>
          <tr>
            <th>Changed User</th>
            <th>Changed By</th>
            <th>Old Role</th>
            <th>New Role</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <tr key={log.id || i}>
              <td>{log.resource_id}</td>
              <td>{log.details?.changed_by}</td>
              <td>{log.details?.old_role}</td>
              <td>{log.details?.new_role}</td>
              <td>{log.created_at ? new Date(log.created_at).toLocaleString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Previous</button>
        <span>Page {page + 1}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={!hasNext}>Next</button>
      </div>
      <p>Showing up to 50 logs per page.</p>
    </div>
  );
} 