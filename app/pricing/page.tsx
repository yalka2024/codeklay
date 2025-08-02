import React from "react";
import { getSession } from "next-auth/react";

const plans = [
  {
    name: "Community",
    price: "Free",
    features: [
      { label: "50 AI requests/month", included: true },
      { label: "Basic collaboration", included: true },
      { label: "Up to 2 plugins", included: true },
      { label: "Community support", included: true },
      { label: "Advanced collab (video, code review, resource sharing)", included: false },
      { label: "SSO, Jira, Slack integrations", included: false },
      { label: "Audit logging & compliance tools", included: false },
    ],
    cta: null,
    highlight: false,
  },
  {
    name: "Pro",
    price: "$25/mo",
    features: [
      { label: "1,000 AI requests/month", included: true },
      { label: "Advanced collaboration", included: true },
      { label: "Up to 10 plugins", included: true },
      { label: "Email support", included: true },
      { label: "SSO, Jira, Slack integrations", included: true },
      { label: "Audit logging & compliance tools", included: true },
    ],
    cta: "/upgrade?plan=pro",
    highlight: true,
  },
  {
    name: "Team",
    price: "$750/mo",
    features: [
      { label: "10,000 AI requests/month", included: true },
      { label: "Advanced collaboration", included: true },
      { label: "Up to 50 plugins", included: true },
      { label: "Priority support", included: true },
      { label: "SSO, Jira, Slack integrations", included: true },
      { label: "Audit logging & compliance tools", included: true },
    ],
    cta: "/upgrade?plan=team",
    highlight: true,
  },
];

export default async function PricingPage() {
  // Mock getSession for demo; replace with real session in prod
  const session = null; // await getSession();
  const userPlan = session?.user?.plan || "Community";

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Pricing & Plans</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded-lg bg-white shadow-sm">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left">Plan</th>
              <th className="py-3 px-4 text-left">Price</th>
              {plans[0].features.map((f, i) => (
                <th key={i} className="py-3 px-4 text-left whitespace-nowrap">{f.label}</th>
              ))}
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, idx) => (
              <tr key={plan.name} className={plan.highlight ? "bg-blue-50" : ""}>
                <td className="py-3 px-4 font-semibold">{plan.name}</td>
                <td className="py-3 px-4">{plan.price}</td>
                {plan.features.map((f, i) => (
                  <td key={i} className="py-3 px-4 text-center">
                    <input type="checkbox" checked={f.included} readOnly aria-label={f.label} className="accent-blue-600" />
                  </td>
                ))}
                <td className="py-3 px-4">
                  {plan.cta ? (
                    <a href={plan.cta} className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">Upgrade</a>
                  ) : (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Current</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center text-gray-500 text-sm mt-6">
        All prices in USD. Cancel anytime. For enterprise or custom plans, <a href="/contact?topic=enterprise" className="text-blue-600 underline">contact us</a>.
      </div>
    </div>
  );
} 