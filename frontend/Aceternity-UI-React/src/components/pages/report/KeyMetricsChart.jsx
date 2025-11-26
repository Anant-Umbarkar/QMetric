import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function KeyMetricsChart({ metrics = {}, fontColor = '#111827' }) {
  // metrics expected: { totalQuestions, matchingQuestions, higherQuestions, lowerQuestions }
  const data = [
    { name: 'Aligned', value: Number(metrics.matchingQuestions ?? 0) },
    { name: 'Higher', value: Number(metrics.higherQuestions ?? 0) },
    { name: 'Lower', value: Number(metrics.lowerQuestions ?? 0) },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#ef4444'];

  if (!data || data.reduce((s, d) => s + d.value, 0) === 0) return null;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3" style={{ color: fontColor }}>Key Metrics</h3>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
