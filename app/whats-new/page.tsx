import React from "react";

const changelog = [
  { date: "2024-07-10", title: "Enterprise SSO & Jira Integration", desc: "Added SSO and Jira ticket linking for enterprise users." },
  { date: "2024-07-05", title: "Cloud Credits System", desc: "Launched cloud credits tracking and redemption." },
  { date: "2024-07-01", title: "Benchmarks Dashboard", desc: "Added dynamic AI performance benchmarks with charts." },
  { date: "2024-06-25", title: "Plugin Marketplace", desc: "Released plugin marketplace and dynamic loading." },
];

export default function WhatsNewPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">What’s New</h1>
      <ul className="space-y-6">
        {changelog.map((entry, i) => (
          <li key={i} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-lg font-semibold">{entry.title}</div>
              <div className="text-gray-500 text-sm mt-1">{entry.desc}</div>
            </div>
            <div className="text-blue-600 font-mono text-sm mt-2 md:mt-0 md:text-right">{entry.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
} 