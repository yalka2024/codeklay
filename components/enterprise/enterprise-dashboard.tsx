import React from "react";
import { SSOSettings } from "./sso-settings";
import { JiraSettings } from "./jira-settings";
import { SlackSettings } from "./slack-settings";
import { TrialBanner } from "./trial-banner";
import { ComplianceChecklist } from "./compliance-checklist";
import dynamic from "next/dynamic";
import { AccessibilityProvider } from "../accessibility/accessibility-provider";
const AnalyticsDashboard = dynamic(() => import("../analytics/analytics-dashboard"), { ssr: false });
const FeedbackSystem = dynamic(() => import("../feedback/FeedbackSystem"), { ssr: false });

const trialExpires = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

export function EnterpriseDashboard() {
  return (
    <AccessibilityProvider>
      <main id="main-content" className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white" aria-label="Enterprise Dashboard">Enterprise Dashboard</h1>
          <a href="/pricing" className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-purple-600 text-white font-semibold shadow-lg hover:from-teal-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2" aria-label="Upgrade to Pro">Upgrade</a>
        </div>
        <TrialBanner expires={trialExpires} />
        <ComplianceChecklist />
        <section aria-labelledby="integrations-heading" className="mt-8">
          <h2 id="integrations-heading" className="text-2xl font-semibold mb-4">Integrations</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <SSOSettings />
            <JiraSettings />
            <SlackSettings />
          </div>
        </section>
        <section aria-labelledby="analytics-heading" className="mt-8">
          <h2 id="analytics-heading" className="text-2xl font-semibold mb-4">Usage Analytics</h2>
          <div className="rounded-lg border bg-background p-4 shadow-sm">
            <AnalyticsDashboard />
          </div>
        </section>
        <section aria-labelledby="security-heading" className="mt-8">
          <h2 id="security-heading" className="text-2xl font-semibold mb-4">Security & Compliance</h2>
          <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-200">
            <li>Role-Based Access Control (RBAC)</li>
            <li>GDPR/SOC2 Compliance</li>
            <li>Audit Logging</li>
            <li>Rate Limiting</li>
            <li>Password Policy</li>
            <li>Analytics Dashboard</li>
          </ul>
          <a href="/docs/en/enterprise-security.md" className="text-teal-600 underline hover:text-teal-800 mt-2 inline-block" aria-label="Learn more about enterprise security and compliance">Learn more about enterprise security & compliance</a>
        </section>
      </main>
      <FeedbackSystem />
    </AccessibilityProvider>
  );
}

export default EnterpriseDashboard; 