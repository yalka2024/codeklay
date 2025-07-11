import React, { useEffect, useState } from "react";

// SSOProviderConfig type (should match backend/api/enterprise/sso-config.model)
type SSOProviderType = 'saml' | 'oauth' | 'oidc';
interface SSOProviderConfig {
  id: string;
  orgId: string;
  type: SSOProviderType;
  name: string;
  enabled: boolean;
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// API utility functions
async function fetchProviders(orgId: string): Promise<SSOProviderConfig[]> {
  const res = await fetch(`/api/enterprise/sso?orgId=${orgId}`);
  return res.json();
}
async function addProvider(orgId: string, provider: Partial<SSOProviderConfig>) {
  const res = await fetch(`/api/enterprise/sso`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...provider, orgId }),
  });
  return res.json();
}
async function updateProvider(id: string, updates: Partial<SSOProviderConfig>) {
  const res = await fetch(`/api/enterprise/sso`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, updates }),
  });
  return res.json();
}
async function removeProvider(id: string) {
  const res = await fetch(`/api/enterprise/sso`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  return res.json();
}
async function testProvider(type: SSOProviderType) {
  let endpoint = '';
  if (type === 'saml') endpoint = '/api/enterprise/sso/saml_login';
  else if (type === 'oauth') endpoint = '/api/enterprise/sso/oauth_login';
  else if (type === 'oidc') endpoint = '/api/enterprise/sso/oidc_login';
  const res = await fetch(endpoint, { method: 'POST' });
  return res.json();
}

const emptyForm = {
  name: '',
  type: 'saml' as SSOProviderType,
  enabled: true,
  config: {},
};

export function SSOAdminSettings({ orgId }: { orgId: string }) {
  const [providers, setProviders] = useState<SSOProviderConfig[]>([]);
  const [enforceSSO, setEnforceSSO] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<any>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchProviders(orgId)
      .then(setProviders)
      .catch(e => setError('Failed to load SSO providers'))
      .finally(() => setLoading(false));
  }, [orgId]);

  async function handleRemove(id: string) {
    setLoading(true);
    await removeProvider(id);
    setProviders(providers => providers.filter(p => p.id !== id));
    setLoading(false);
  }

  function openAddModal() {
    setForm(emptyForm);
    setEditId(null);
    setFormError(null);
    setShowModal(true);
  }
  function openEditModal(provider: SSOProviderConfig) {
    setForm({ ...provider });
    setEditId(provider.id);
    setFormError(null);
    setShowModal(true);
  }
  function closeModal() {
    setShowModal(false);
    setFormError(null);
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox') {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setForm((prev: any) => ({ ...prev, [name]: fieldValue }));
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return setFormError('Name is required');
    if (!form.type) return setFormError('Type is required');
    setFormError(null);
    setLoading(true);
    if (editId) {
      const updated = await updateProvider(editId, form);
      setProviders(providers => providers.map(p => p.id === editId ? updated : p));
    } else {
      const added = await addProvider(orgId, form);
      setProviders(providers => [...providers, added]);
    }
    setLoading(false);
    closeModal();
  }

  async function handleTest(type: SSOProviderType) {
    setTestResult(null);
    setLoading(true);
    try {
      const result = await testProvider(type);
      if (result.url) {
        window.open(result.url, '_blank');
        setTestResult('SSO login URL opened in new tab.');
      } else if (result.error) {
        setTestResult(`Error: ${result.error}`);
      } else {
        setTestResult('Unknown response from SSO test.');
      }
    } catch (e) {
      setTestResult('Failed to test SSO provider.');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>SSO Provider Management</h2>
      <label style={{ display: 'block', margin: '1rem 0' }}>
        <input
          type="checkbox"
          checked={enforceSSO}
          onChange={e => setEnforceSSO(e.target.checked)}
        />
        Enforce SSO-only login for this organization
      </label>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table style={{ width: '100%', marginBottom: 24 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p, idx) => (
            <tr key={p.id || idx}>
              <td>{p.name}</td>
              <td>{p.type}</td>
              <td>{p.enabled ? 'Enabled' : 'Disabled'}</td>
              <td>
                <button onClick={() => openEditModal(p)}>Edit</button>{' '}
                <button onClick={() => handleRemove(p.id)}>Remove</button>{' '}
                <button onClick={() => handleTest(p.type)}>Test</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {testResult && <p style={{ color: testResult.startsWith('Error') ? 'red' : 'green' }}>{testResult}</p>}
      <button onClick={openAddModal}>Add SSO Provider</button>
      <p style={{ marginTop: 16 }}>
        Contact support for advanced SSO configuration or troubleshooting.
      </p>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.2)', zIndex: 1000 }}>
          <div style={{ background: '#fff', maxWidth: 400, margin: '5% auto', padding: 24, borderRadius: 8 }}>
            <h3>{editId ? 'Edit' : 'Add'} SSO Provider</h3>
            <form onSubmit={handleFormSubmit}>
              <label>
                Name:
                <input name="name" value={form.name} onChange={handleFormChange} required style={{ width: '100%' }} />
              </label>
              <br />
              <label>
                Type:
                <select name="type" value={form.type} onChange={handleFormChange} required style={{ width: '100%' }}>
                  <option value="saml">SAML</option>
                  <option value="oauth">OAuth</option>
                  <option value="oidc">OIDC</option>
                </select>
              </label>
              <br />
              <label>
                Enabled:
                <input name="enabled" type="checkbox" checked={form.enabled} onChange={handleFormChange} />
              </label>
              {/* Provider-specific config fields could go here */}
              {formError && <p style={{ color: 'red' }}>{formError}</p>}
              <div style={{ marginTop: 16 }}>
                <button type="submit">{editId ? 'Update' : 'Add'}</button>{' '}
                <button type="button" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 