'use client';

import React, { useState } from 'react';
import { getEmbedding } from '../backend/api/ai/embedding-util';
import { toast } from './ui/use-toast';
import { Button } from './ui/button';

export function SemanticSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const embedding = await getEmbedding(query);
      const res = await fetch('/api/vector-search/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'dev-key', // Replace with real key/session
        },
        body: JSON.stringify({ embedding, k: 5 }),
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (e: any) {
      setError(e.message || 'Search failed');
      toast({ title: 'Error', description: e.message || 'Search failed', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Semantic Search</h2>
      <form className="flex mb-4" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
        <label htmlFor="semantic-search-input" className="sr-only">Semantic Search Query</label>
        <input
          id="semantic-search-input"
          className="flex-1 border p-2 rounded-l"
          placeholder="Search code, docs, or chat..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Semantic search query"
        />
        <Button type="submit" className="rounded-r" disabled={loading || !query}>
          {loading ? <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full inline-block"></span> : 'Search'}
        </Button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <ul className="space-y-3">
        {results.map((r, i) => (
          <li key={r.id || i} className="p-4 border rounded bg-white">
            <div className="mb-2 text-sm text-muted-foreground">{r.metadata?.type || 'Document'}</div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mb-2 max-h-40">{r.content}</pre>
            <Button type="button" className="text-xs bg-gray-200 px-2 py-1 rounded" onClick={() => handleCopy(r.content)} aria-label="Copy result content">Copy</Button>
          </li>
        ))}
      </ul>
    </div>
  );
} 