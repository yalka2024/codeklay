import React from "react";

export function OnboardingBanner({ lang }: { lang: string }) {
  return (
    <div style={{ background: '#e0f7fa', padding: 24, borderRadius: 8, margin: '2rem 0', textAlign: 'center' }}>
      <h2>Welcome to CodePal!</h2>
      <p>Get started with our quick guide in your language.</p>
      <a
        href={`/docs/${lang}/getting-started`}
        style={{
          display: 'inline-block',
          marginTop: 16,
          padding: '8px 20px',
          background: '#0070f3',
          color: '#fff',
          borderRadius: 4,
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Learn More
      </a>
    </div>
  );
} 