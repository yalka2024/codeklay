import React, { useState } from "react";
import Link from "next/link";

export default function UpgradePage() {
  const [plan, setPlan] = useState<'pro' | 'team'>('pro');
  const [success, setSuccess] = useState(false);

  function handleUpgrade(e: React.FormEvent) {
    e.preventDefault();
    // Stub: In production, integrate Stripe/payment provider
    setTimeout(() => setSuccess(true), 1000);
  }

  if (success) {
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: 32, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Upgrade Successful!</h1>
        <p style={{ marginBottom: 24 }}>Thank you for upgrading to the {plan === 'pro' ? 'Pro' : 'Team'} plan. Your account will be updated shortly.</p>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline', fontWeight: 600 }}>Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Upgrade Your Plan</h1>
      <p style={{ marginBottom: 24 }}>Select a plan and enter your payment details to upgrade.</p>
      <form onSubmit={handleUpgrade} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label>
          <input type="radio" name="plan" value="pro" checked={plan === 'pro'} onChange={() => setPlan('pro')} /> Pro ($25/mo)
        </label>
        <label>
          <input type="radio" name="plan" value="team" checked={plan === 'team'} onChange={() => setPlan('team')} /> Team ($750/mo)
        </label>
        <input type="text" placeholder="Card Number (stub)" required style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        <input type="text" placeholder="Expiration (MM/YY)" required style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        <input type="text" placeholder="CVC" required style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        <button type="submit" style={{ background: '#0070f3', color: '#fff', padding: '10px 24px', borderRadius: 6, fontWeight: 600, border: 'none', cursor: 'pointer' }}>Upgrade</button>
      </form>
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link href="/pricing" style={{ color: '#0070f3', textDecoration: 'underline' }}>See all plans & pricing</Link>
      </div>
    </div>
  );
} 