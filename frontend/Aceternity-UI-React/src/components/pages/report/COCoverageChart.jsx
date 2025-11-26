import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

// Shows Actual vs Expected per CO. Prefers `coRecommendations` when available.
export default function COCoverageChart({ coData = {}, coRecommendations = [], fontColor = '#111827' }) {
  let data = [];

  if (Array.isArray(coRecommendations) && coRecommendations.length > 0) {
    data = coRecommendations.map((r) => ({
      co: r.co || `CO${r.co}`,
      expected: Number(r.expected ?? 0),
      actual: Number(r.actual ?? 0),
    }));
  } else {
    const keys = Object.keys(coData || {});
    data = keys.map((k) => ({ co: `CO${k}`, expected: 0, actual: Number(coData[k] ?? 0) }));
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3" style={{ color: fontColor }}>Course Outcome: Actual vs Expected</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="co" stroke={fontColor} />
            <YAxis stroke={fontColor} />
            <Tooltip />
            <Legend />
            <Bar dataKey="expected" fill="#a3e635" name="Expected %" />
            <Bar dataKey="actual" fill="#16a34a" name="Actual %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
