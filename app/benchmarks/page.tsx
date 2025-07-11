import React from "react";
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export default async function BenchmarksPage() {
  // Read the markdown file at build time (for demo; use API in prod)
  const filePath = path.join(process.cwd(), 'docs', 'BENCHMARKS.md');
  const md = fs.readFileSync(filePath, 'utf-8');
  const html = marked(md);
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Public Benchmarks</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
} 