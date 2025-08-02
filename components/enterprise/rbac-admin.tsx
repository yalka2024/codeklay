import React, { useState, useEffect } from "react";

const roles = ['user', 'admin', 'owner', 'auditor'];

type User = {
  id: string;
  email: string;
  role: string;
};

export function RBACAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/users');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load users');
        setUsers(data.users);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  async function handleRoleChange(id: string, role: string) {
    setSaving(id);
    setError(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update role');
      setUsers(users => users.map(u => u.id === id ? { ...u, role } : u));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>User Roles & Permissions</h2>
      {loading ? <p>Loading users...</p> : null}
      {error ? <p style={{ color: 'red' }}>{error}</p> : null}
      <table style={{ width: '100%', marginBottom: 24 }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>
                <select
                  value={u.role}
                  onChange={e => handleRoleChange(u.id, e.target.value)}
                  disabled={saving === u.id}
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {saving === u.id ? <span style={{ marginLeft: 8 }}>Saving...</span> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Contact support for advanced permission management.</p>
    </div>
  );
} 