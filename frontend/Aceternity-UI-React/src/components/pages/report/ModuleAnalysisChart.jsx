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

export default function ModuleAnalysisChart({ moduleData = [], fontColor = '#111827' }) {
  if (!moduleData || moduleData.length === 0) return null;

  const data = moduleData.map((m, idx) => ({
    name: m.name || `Module ${idx + 1}`,
    expected: Number(m.expected ?? 0),
    actual: Number(m.actual ?? 0),
  }));

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3" style={{ color: fontColor }}>Module Analysis</h3>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke={fontColor} />
            <YAxis stroke={fontColor} />
            <Tooltip />
            <Legend />
            <Bar dataKey="expected" fill="#60a5fa" name="Expected %" />
            <Bar dataKey="actual" fill="#2563eb" name="Actual %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
