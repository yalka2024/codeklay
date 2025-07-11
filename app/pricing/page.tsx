import React from "react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Pricing & Plans</h1>
      <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginBottom: 40 }}>
        {/* Community Edition */}
        <div style={{ flex: 1, border: '1px solid #e0e0e0', borderRadius: 12, padding: 24, background: '#f8fafc' }}>
          <h2 style={{ fontSize: 22, fontWeight: 600 }}>Community Edition</h2>
          <div style={{ fontSize: 28, fontWeight: 700, margin: '12px 0' }}>Free</div>
          <ul style={{ marginBottom: 16 }}>
            <li>✔️ 50 AI requests/month</li>
            <li>✔️ Basic collaboration</li>
            <li>✔️ Up to 2 plugins</li>
            <li>✔️ Community support</li>
            <li>❌ Advanced collab (video, code review, resource sharing)</li>
            <li>❌ SSO, Jira, Slack integrations</li>
            <li>❌ Audit logging & compliance tools</li>
          </ul>
          <span style={{ background: '#e0eaff', color: '#0056b3', padding: '2px 8px', borderRadius: 4, fontWeight: 600, fontSize: 13 }}>Community Edition</span>
        </div>
        {/* Pro Plan */}
        <div style={{ flex: 1, border: '2px solid #0070f3', borderRadius: 12, padding: 24, background: '#fff' }}>
          <h2 style={{ fontSize: 22, fontWeight: 600 }}>Pro</h2>
          <div style={{ fontSize: 28, fontWeight: 700, margin: '12px 0' }}>$25<span style={{ fontSize: 16, fontWeight: 400 }}>/mo</span></div>
          <ul style={{ marginBottom: 16 }}>
            <li>✔️ 1,000 AI requests/month</li>
            <li>✔️ Advanced collaboration</li>
            <li>✔️ Up to 10 plugins</li>
            <li>✔️ Email support</li>
            <li>✔️ SSO, Jira, Slack integrations</li>
            <li>✔️ Audit logging & compliance tools</li>
          </ul>
          <Link href="/upgrade?plan=pro" style={{ background: '#0070f3', color: '#fff', padding: '10px 24px', borderRadius: 6, fontWeight: 600, textDecoration: 'none' }}>Upgrade to Pro</Link>
        </div>
        {/* Team Plan */}
        <div style={{ flex: 1, border: '2px solid #0070f3', borderRadius: 12, padding: 24, background: '#fff' }}>
          <h2 style={{ fontSize: 22, fontWeight: 600 }}>Team</h2>
          <div style={{ fontSize: 28, fontWeight: 700, margin: '12px 0' }}>$750<span style={{ fontSize: 16, fontWeight: 400 }}>/mo</span></div>
          <ul style={{ marginBottom: 16 }}>
            <li>✔️ 10,000 AI requests/month</li>
            <li>✔️ Advanced collaboration</li>
            <li>✔️ Up to 50 plugins</li>
            <li>✔️ Priority support</li>
            <li>✔️ SSO, Jira, Slack integrations</li>
            <li>✔️ Audit logging & compliance tools</li>
          </ul>
          <Link href="/upgrade?plan=team" style={{ background: '#0070f3', color: '#fff', padding: '10px 24px', borderRadius: 6, fontWeight: 600, textDecoration: 'none' }}>Upgrade to Team</Link>
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#888', fontSize: 15 }}>
        All prices in USD. Cancel anytime. For enterprise or custom plans, <a href="/contact?topic=enterprise" style={{ color: '#0070f3', textDecoration: 'underline' }}>contact us</a>.
      </div>
    </div>
  );
} 