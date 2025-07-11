import React from "react";

export default function PartnersPage() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 24 }}>Partnerships & Open-Source Collaboration</h1>
      <p style={{ marginBottom: 24 }}>
        CodePal is committed to building a vibrant developer ecosystem. We welcome open-source projects, startups, and companies to partner, integrate, or cross-promote with us.
      </p>
      <ul style={{ marginBottom: 24 }}>
        <li>• Cross-promotion with open-source tools and communities</li>
        <li>• Joint webinars, blog posts, and live events</li>
        <li>• API and plugin integrations</li>
        <li>• Early access and co-marketing opportunities</li>
      </ul>
      <p style={{ marginBottom: 24 }}>
        <strong>Interested?</strong> Reach out via our <a href="/contact?topic=partnership" style={{ color: '#0070f3', textDecoration: 'underline' }}>partnership form</a> or email <a href="mailto:partners@codepal.dev" style={{ color: '#0070f3', textDecoration: 'underline' }}>partners@codepal.dev</a>.
      </p>
      <div style={{ background: '#e0eaff', color: '#0056b3', padding: 16, borderRadius: 8, fontWeight: 600 }}>
        Let’s build the future of developer tools—together!
      </div>
    </div>
  );
} 