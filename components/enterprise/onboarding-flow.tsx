import React from "react";
import { SSOSettings } from "./sso-settings";
import { JiraSettings } from "./jira-settings";
import { SlackSettings } from "./slack-settings";
import { ComplianceChecklist } from "./compliance-checklist";

export function EnterpriseOnboardingFlow() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
      <h2>Enterprise Onboarding</h2>
      <ol style={{ lineHeight: 2 }}>
        <li>
          <strong>Enable SSO:</strong>
          <SSOSettings />
        </li>
        <li>
          <strong>Connect Jira:</strong>
          <JiraSettings />
        </li>
        <li>
          <strong>Connect Slack:</strong>
          <SlackSettings />
        </li>
        <li>
          <strong>Review Compliance Checklist:</strong>
          <ComplianceChecklist />
        </li>
        <li>
          <strong>Explore Analytics & Audit Logging:</strong>
          <p>Access the analytics dashboard and audit logs from your admin panel.</p>
        </li>
      </ol>
    </div>
  );
} 