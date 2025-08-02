import React, { useState, useEffect } from "react";

export function SlackSettings() {
  const orgId = 'demo-org'; // Replace with real org context
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'unknown'>('unknown');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState('');

  async function fetchStatus() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/enterprise/slack?orgId=${orgId}`);
      const data = await res.json();
      setStatus(data.connected ? 'connected' : 'disconnected');
    } catch (e: any) {
      setError(e.message);
      setStatus('unknown');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStatus(); }, []);

  async function handleConnect() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/enterprise/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', orgId, token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to connect');
      setStatus('connected');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/enterprise/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect', orgId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to disconnect');
      setStatus('disconnected');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTest() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/enterprise/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', orgId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Test failed');
      alert(data.message || 'Test passed!');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Slack Integration</h2>
      <p>Connect your Slack workspace to receive notifications and collaborate in real time.</p>
      <div>Status: <strong>{status}</strong></div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {status !== 'connected' && (
        <div style={{ margin: '8px 0' }}>
          <input
            type="text"
            placeholder="Slack Token"
            value={token}
            onChange={e => setToken(e.target.value)}
            disabled={loading}
            style={{ marginRight: 8 }}
          />
          <button onClick={handleConnect} disabled={loading || !token}>Connect</button>
        </div>
      )}
      {status === 'connected' && (
        <div style={{ margin: '8px 0' }}>
          <button onClick={handleTest} disabled={loading}>Test Connection</button>
          <button onClick={handleDisconnect} disabled={loading} style={{ marginLeft: 8 }}>Disconnect</button>
        </div>
      )}
    </div>
  );
} 