import React from "react";
import { useEntitlement } from '../../hooks/use-entitlement';

export function TrialBanner({ expires }: { expires: Date }) {
  const { isFree } = useEntitlement();
  return (
    <div style={{ background: '#fff3cd', padding: 16, borderRadius: 8, margin: '1rem 0', textAlign: 'center', border: '1px solid #ffeeba', position: 'relative' }}>
      {isFree && (
        <span style={{ position: 'absolute', left: 16, top: 16, background: '#e0eaff', color: '#0056b3', padding: '2px 8px', borderRadius: 4, fontWeight: 600, fontSize: 13 }}>
          Community Edition
        </span>
      )}
      <strong>Enterprise Trial:</strong> You are enjoying a free 30-day enterprise trial!
      <br />
      <span>Expires on: {expires.toLocaleDateString()}</span>
      <br />
      <span style={{ color: '#856404', fontWeight: 500 }}>
        Unlock enterprise-grade security: RBAC, audit logging, SSO, integrations, and compliance tools.
      </span>
      <br />
      <a href="/docs/en/enterprise-security.md" style={{ color: '#0070f3', textDecoration: 'underline', marginRight: 16 }}>See security & compliance features</a>
      <a href="/pricing" style={{ color: '#0070f3', textDecoration: 'underline', marginRight: 16 }}>Upgrade to Pro ($25/mo)</a>
      <a href="/contact?topic=enterprise-demo" style={{ color: '#0070f3', textDecoration: 'underline' }}>Request a demo</a>
    </div>
  );
} 