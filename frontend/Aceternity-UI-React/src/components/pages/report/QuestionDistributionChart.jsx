import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function QuestionDistributionChart({ questionData = [], fontColor = '#111827' }) {
  if (!questionData || questionData.length === 0) return null;

  // Question-wise marks
  const questionMarks = questionData.map((q, idx) => ({ name: `Q${idx + 1}`, marks: Number(q.Marks ?? 0) }));

  // Bloom-wise counts
  const bloomCounts = {};
  questionData.forEach((q) => {
    const level = q["Bloom's Taxonomy Level"] || 'Unknown';
    bloomCounts[level] = (bloomCounts[level] || 0) + 1;
  });
  const bloomData = Object.keys(bloomCounts).map((k) => ({ name: k, value: bloomCounts[k] }));

  const COLORS = ['#60a5fa', '#34d399', '#f59e0b', '#f97316', '#ef4444', '#a78bfa'];

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3" style={{ color: fontColor }}>Question-wise & Bloom Distribution</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={questionMarks} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke={fontColor} />
              <YAxis stroke={fontColor} />
              <Tooltip />
              <Bar dataKey="marks" fill="#2563eb" name="Marks" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={bloomData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {bloomData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
