import React from "react";
import { OnboardingBanner } from "@/components/onboarding-banner";
import { HelpButton } from "@/components/help-button";

// Example: You might get the user's language from context, settings, or router
const userLang = 'en'; // Replace with dynamic detection as needed

export default function HomePage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <div style={{ background: '#e0eaff', color: '#0056b3', padding: '4px 16px', borderRadius: 6, fontWeight: 700, fontSize: 16, display: 'inline-block', marginBottom: 16 }}>
        Community Edition
      </div>
      <h1>Welcome to CodePal</h1>
      <a href="/benchmarks" style={{ color: '#0070f3', textDecoration: 'underline', fontWeight: 600, marginBottom: 8, display: 'inline-block' }}>See Public Benchmarks</a>
      <a href="/whats-new" style={{ color: '#0070f3', textDecoration: 'underline', fontWeight: 600, marginBottom: 8, display: 'inline-block', marginLeft: 16 }}>What’s New</a>
      <a href="/cloud-credits" style={{ color: '#0070f3', textDecoration: 'underline', fontWeight: 600, marginBottom: 8, display: 'inline-block', marginLeft: 16 }}>Cloud Credits</a>
      <a href="/partners" style={{ color: '#0070f3', textDecoration: 'underline', fontWeight: 600, marginBottom: 16, display: 'inline-block', marginLeft: 16 }}>Partners</a>
      {/* Onboarding banner with localized docs link */}
      <OnboardingBanner lang={userLang} />
      <p>
        CodePal is your AI-powered developer platform. Explore features, collaborate, and extend with plugins.
      </p>
      {/* Help button with localized FAQ link */}
      <div style={{ marginTop: 32 }}>
        <HelpButton lang={userLang} />
      </div>
    </div>
  );
} 