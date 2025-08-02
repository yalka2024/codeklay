'use client';

import React, { useEffect, useState } from 'react';
import { toast } from './ui/use-toast';
import { Button } from './ui/button';
import { UpgradePrompt } from './ui/upgrade-prompt';

export function PluginMarketplace() {
  const [plugins, setPlugins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [newPlugin, setNewPlugin] = useState({ name: '', description: '', version: '1.0.0', id: '', enabled: true });

  const fetchPlugins = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/plugins');
      const data = await res.json();
      setPlugins(data.plugins || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load plugins');
    }
    setLoading(false);
  };

  useEffect(() => { fetchPlugins(); }, []);

  const togglePlugin = async (id: string, enabled: boolean) => {
    try {
      const res = await fetch('/api/plugins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled }),
      });
      const data = await res.json();
      if (res.status === 402) {
        setUpgradeError(data.error || 'Upgrade to enable more plugins.');
        return;
      }
      toast({ title: enabled ? 'Plugin enabled' : 'Plugin disabled' });
      fetchPlugins();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to update plugin', variant: 'destructive' });
    }
  };

  const registerPlugin = async () => {
    if (!newPlugin.id || !newPlugin.name) return;
    try {
      const res = await fetch('/api/plugins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlugin),
      });
      const data = await res.json();
      if (res.status === 402) {
        setUpgradeError(data.error || 'Upgrade to enable more plugins.');
        return;
      }
      setNewPlugin({ name: '', description: '', version: '1.0.0', id: '', enabled: true });
      toast({ title: 'Plugin registered' });
      fetchPlugins();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to register plugin', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Plugin Marketplace</h2>
      {upgradeError && <UpgradePrompt message={upgradeError} />}
      <div className="mb-6 p-4 border rounded bg-muted">
        <h3 className="font-semibold mb-2">Register New Plugin</h3>
        <label htmlFor="plugin-id" className="sr-only">Plugin ID</label>
        <input id="plugin-id" className="border p-1 mr-2" placeholder="ID" value={newPlugin.id} onChange={e => setNewPlugin(p => ({ ...p, id: e.target.value }))} />
        <label htmlFor="plugin-name" className="sr-only">Plugin Name</label>
        <input id="plugin-name" className="border p-1 mr-2" placeholder="Name" value={newPlugin.name} onChange={e => setNewPlugin(p => ({ ...p, name: e.target.value }))} />
        <label htmlFor="plugin-desc" className="sr-only">Plugin Description</label>
        <input id="plugin-desc" className="border p-1 mr-2" placeholder="Description" value={newPlugin.description} onChange={e => setNewPlugin(p => ({ ...p, description: e.target.value }))} />
        <Button className="px-3 py-1" onClick={registerPlugin}>Register</Button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div>
        {loading ? <div className="flex items-center gap-2"><span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></span> Loading plugins...</div> : (
          <ul className="space-y-3">
            {plugins.map(plugin => (
              <li key={plugin.id} className="p-4 border rounded flex flex-col md:flex-row items-start md:items-center justify-between bg-white">
                <div className="mb-2 md:mb-0">
                  <div className="font-semibold">{plugin.name}</div>
                  <div className="text-xs text-muted-foreground">{plugin.description}</div>
                  <div className="text-xs">Version: {plugin.version}</div>
                </div>
                <Button
                  className={`ml-0 md:ml-4 px-3 py-1 mt-2 md:mt-0 ${plugin.enabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                  onClick={() => togglePlugin(plugin.id, !plugin.enabled)}
                  aria-label={plugin.enabled ? 'Disable plugin' : 'Enable plugin'}
                >
                  {plugin.enabled ? 'Disable' : 'Enable'}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 