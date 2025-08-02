import React from "react";

const partners = [
  { name: "Open Source Initiative", desc: "Promoting open-source software and standards.", url: "https://opensource.org/" },
  { name: "AWS Activate", desc: "Cloud credits and support for startups.", url: "https://aws.amazon.com/activate/" },
  { name: "Azure for Startups", desc: "Cloud credits and resources for new ventures.", url: "https://azure.microsoft.com/en-us/free/startups/" },
  { name: "Dev.to Community", desc: "Developer community and cross-promotion.", url: "https://dev.to/" },
];

export default function PartnersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Partnerships & Open-Source Collaboration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {partners.map((p, i) => (
          <a
            key={i}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={`Partner: ${p.name}`}
          >
            <div className="text-xl font-semibold mb-2 text-blue-700">{p.name}</div>
            <div className="text-gray-600 text-sm">{p.desc}</div>
          </a>
        ))}
      </div>
      <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded mt-8 font-semibold text-center">
        Let’s build the future of developer tools—together!
      </div>
    </div>
  );
} 