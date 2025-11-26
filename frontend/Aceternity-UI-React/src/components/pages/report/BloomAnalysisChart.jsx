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

export default function BloomsAnalysisChart({ bloomsData = {}, fontColor = '#111827' }) {
  const levels = Object.keys(bloomsData || {});
  if (!levels || levels.length === 0) return null;

  const data = levels.map((level) => {
    const b = bloomsData[level] || {};
    return {
      name: b.name || `Level ${level}`,
      expected: Number(b.weights ?? 0),
      actual: Number(b.marks ?? 0),
      questions: Number(b.No_Of_Questions ?? 0),
    };
  });

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3" style={{ color: fontColor }}>Bloom's Taxonomy Analysis</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke={fontColor} />
            <YAxis stroke={fontColor} />
            <Tooltip />
            <Legend />
            <Bar dataKey="expected" fill="#a78bfa" name="Expected %" />
            <Bar dataKey="actual" fill="#7c3aed" name="Actual %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
