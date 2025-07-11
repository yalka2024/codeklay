import React from "react";
import { SSOSettings } from "./sso-settings";
import { JiraSettings } from "./jira-settings";
import { SlackSettings } from "./slack-settings";
import { TrialBanner } from "./trial-banner";
import { ComplianceChecklist } from "./compliance-checklist";

// Example: trial expiration date (replace with real data)
const trialExpires = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

export function EnterpriseDashboard() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <h1>Enterprise Dashboard</h1>
      <TrialBanner expires={trialExpires} />
      <ComplianceChecklist />
      <section style={{ margin: '2rem 0' }}>
        <h2>Integrations</h2>
        <div style={{ display: 'flex', gap: 32 }}>
          <SSOSettings />
          <JiraSettings />
          <SlackSettings />
        </div>
      </section>
      <section style={{ margin: '2rem 0' }}>
        <h2>Security & Compliance</h2>
        <ul>
          <li>Role-Based Access Control (RBAC)</li>
          <li>GDPR/SOC2 Compliance</li>
          <li>Audit Logging</li>
          <li>Rate Limiting</li>
          <li>Password Policy</li>
          <li>Analytics Dashboard</li>
        </ul>
        <a href="/docs/en/enterprise-security.md" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          Learn more about enterprise security & compliance
        </a>
      </section>
    </div>
  );
}

export default EnterpriseDashboard 