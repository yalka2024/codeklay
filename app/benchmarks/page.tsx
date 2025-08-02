import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Jan", AI: 120, Users: 30 },
  { name: "Feb", AI: 200, Users: 45 },
  { name: "Mar", AI: 150, Users: 60 },
  { name: "Apr", AI: 250, Users: 80 },
  { name: "May", AI: 300, Users: 100 },
];

export default function BenchmarksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Public Benchmarks</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="AI" stroke="#2563eb" strokeWidth={2} />
            <Line type="monotone" dataKey="Users" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 