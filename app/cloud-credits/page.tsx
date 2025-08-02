import React, { useState } from "react";

export default function CloudCreditsPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Cloud Credits Pilot Program</h1>
      <p className="mb-6 text-gray-700">
        CodePal is partnering with AWS and Azure to offer cloud credits for eligible startups, open-source projects, and teams.
      </p>
      <ul className="mb-6 list-disc list-inside text-gray-700">
        <li>Up to $5,000 in AWS or Azure credits</li>
        <li>Priority onboarding and support</li>
        <li>Early access to new CodePal features</li>
      </ul>
      <p className="mb-6 text-gray-700">
        <strong>How to apply:</strong> Fill out the form below or email <a href="mailto:partners@codepal.dev" className="text-blue-600 underline">partners@codepal.dev</a>.
      </p>
      <form onSubmit={handleSubmit} className="bg-blue-50 rounded-lg p-6 flex flex-col gap-4">
        <label htmlFor="email" className="font-semibold">Email address</label>
        <input
          id="email"
          type="email"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          aria-label="Email address"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Apply for Credits"}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {submitted && <div className="text-green-600 text-sm">Thank you! We’ll review your request and contact you soon.</div>}
      </form>
      <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded mt-8 font-semibold text-center">
        Limited spots available. Apply now to accelerate your project with CodePal + cloud credits!
      </div>
    </div>
  );
} 