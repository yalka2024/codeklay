import React from "react";
import { SSOSettings } from "./sso-settings";
import { JiraSettings } from "./jira-settings";
import { SlackSettings } from "./slack-settings";
import { ComplianceChecklist } from "./compliance-checklist";
import dynamic from "next/dynamic";
import { AccessibilityProvider } from "../accessibility/accessibility-provider";
const FeedbackSystem = dynamic(() => import("../feedback/FeedbackSystem"), { ssr: false });

export function EnterpriseOnboardingFlow() {
  return (
    <AccessibilityProvider>
      <main id="main-content" className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white" aria-label="Enterprise Onboarding">Enterprise Onboarding</h2>
          <a href="/pricing" className="inline-block px-5 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-purple-600 text-white font-semibold shadow-lg hover:from-teal-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2" aria-label="Upgrade to Pro">Upgrade</a>
        </div>
        <ol className="list-decimal pl-6 space-y-8" aria-label="Onboarding Steps">
          <li className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <strong className="block text-lg mb-2">Enable SSO</strong>
            <SSOSettings />
          </li>
          <li className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <strong className="block text-lg mb-2">Connect Jira</strong>
            <JiraSettings />
          </li>
          <li className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <strong className="block text-lg mb-2">Connect Slack</strong>
            <SlackSettings />
          </li>
          <li className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <strong className="block text-lg mb-2">Review Compliance Checklist</strong>
            <ComplianceChecklist />
          </li>
          <li className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <strong className="block text-lg mb-2">Explore Analytics & Audit Logging</strong>
            <p className="mb-2">Access the analytics dashboard and audit logs from your admin panel.</p>
            <a href="/enterprise/dashboard" className="text-teal-600 underline hover:text-teal-800" aria-label="Go to Enterprise Dashboard">Go to Enterprise Dashboard</a>
          </li>
        </ol>
      </main>
      <FeedbackSystem />
    </AccessibilityProvider>
  );
} 