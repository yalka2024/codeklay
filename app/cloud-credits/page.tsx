import React from "react";

export default function CloudCreditsPage() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Cloud Credits Pilot Program</h1>
      <p style={{ marginBottom: 24 }}>
        CodePal is partnering with AWS and Azure to offer cloud credits for eligible startups, open-source projects, and teams.
      </p>
      <ul style={{ marginBottom: 24 }}>
        <li>• Up to $5,000 in AWS or Azure credits</li>
        <li>• Priority onboarding and support</li>
        <li>• Early access to new CodePal features</li>
      </ul>
      <p style={{ marginBottom: 24 }}>
        <strong>How to apply:</strong> Fill out our <a href="/contact?topic=cloud-credits" style={{ color: '#0070f3', textDecoration: 'underline' }}>cloud credits request form</a> or email <a href="mailto:partners@codepal.dev" style={{ color: '#0070f3', textDecoration: 'underline' }}>partners@codepal.dev</a>.
      </p>
      <div style={{ background: '#e0eaff', color: '#0056b3', padding: 16, borderRadius: 8, fontWeight: 600 }}>
        Limited spots available. Apply now to accelerate your project with CodePal + cloud credits!
      </div>
    </div>
  );
} 