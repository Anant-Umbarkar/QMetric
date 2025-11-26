import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ModuleHoursChart({ moduleHours = {}, fontColor = '#111827' }) {
  const keys = Object.keys(moduleHours || {});
  if (!keys || keys.length === 0) return null;

  const data = keys.map((k) => ({ name: k, hours: Number(moduleHours[k] ?? 0) }));

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-3" style={{ color: fontColor }}>Module Hours</h3>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke={fontColor} />
            <YAxis stroke={fontColor} />
            <Tooltip />
            <Bar dataKey="hours" fill="#60a5fa" name="Hours" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
