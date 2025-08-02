import React from 'react';

export function UpgradePrompt({ message, cta = 'Upgrade Now', onUpgrade }: { message: string; cta?: string; onUpgrade?: () => void }) {
  return (
    <div style={{ background: '#e0eaff', color: '#0056b3', padding: 16, borderRadius: 8, margin: '1rem 0', textAlign: 'center', border: '1px solid #b3d1ff' }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{message}</div>
      <button
        style={{ background: '#0070f3', color: '#fff', padding: '8px 24px', borderRadius: 6, fontWeight: 600, border: 'none', cursor: 'pointer' }}
        onClick={onUpgrade || (() => { window.location.href = '/pricing'; })}
      >
        {cta}
      </button>
    </div>
  );
} 