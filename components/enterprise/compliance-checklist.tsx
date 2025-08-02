import React from "react";

const checklist = [
  "Role-Based Access Control (RBAC) enabled",
  "GDPR/SOC2 compliance documentation reviewed",
  "Audit logging configured",
  "Rate limiting enabled",
  "Password policy enforced",
  "Analytics dashboard set up",
];

export function ComplianceChecklist() {
  return (
    <div style={{ background: '#e9ecef', padding: 16, borderRadius: 8, margin: '2rem 0' }}>
      <h3>Enterprise Compliance Onboarding Checklist</h3>
      <ul>
        {checklist.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 8 }}>
            <input type="checkbox" disabled /> {item}
          </li>
        ))}
      </ul>
      <p>Contact support for a compliance review or audit.</p>
    </div>
  );
} 