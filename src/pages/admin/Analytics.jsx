import { mockAnalytics } from "../../data/mockData";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const chartStyle = {
  contentStyle: { borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.07)" },
  axisStyle: { fontSize: 12, fill: "#9ca3af" },
};

export default function Analytics() {
  return (
    <div className="p-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-3xl text-navy">Analytics</h1>
        <p className="text-gray-500 mt-1">Platform-wide performance insights</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Claims Over Time */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in stagger-1">
          <h3 className="font-bold text-navy mb-1">Claims Volume</h3>
          <p className="text-xs text-gray-400 mb-5">Monthly submissions</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockAnalytics.claimsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={chartStyle.axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={chartStyle.axisStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartStyle.contentStyle} />
              <Line type="monotone" dataKey="claims" stroke="#1A3C5E" strokeWidth={2.5} dot={{ fill: "#1A3C5E", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Claims by Type */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in stagger-2">
          <h3 className="font-bold text-navy mb-1">Claims by Type</h3>
          <p className="text-xs text-gray-400 mb-5">Distribution across all claims</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockAnalytics.claimsByType} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="type" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={chartStyle.axisStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartStyle.contentStyle} />
              <Bar dataKey="count" fill="#7C3AED" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Win Rate by Type */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in stagger-3">
          <h3 className="font-bold text-navy mb-1">Win Rate by Claim Type</h3>
          <p className="text-xs text-gray-400 mb-5">Percentage of successfully defended claims</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockAnalytics.winRateByType} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="type" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={chartStyle.axisStyle} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip contentStyle={chartStyle.contentStyle} formatter={v => [`${v}%`, "Win Rate"]} />
              <Bar dataKey="rate" fill="#2ECC71" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Avg Response Time */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in stagger-4">
          <h3 className="font-bold text-navy mb-1">Avg Response Time</h3>
          <p className="text-xs text-gray-400 mb-5">Minutes per claim (target: &lt;15 min)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={[
              { month: "Jan", time: 18 }, { month: "Feb", time: 15 }, { month: "Mar", time: 13 },
              { month: "Apr", time: 11 }, { month: "May", time: 10 }, { month: "Jun", time: 11 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={chartStyle.axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={chartStyle.axisStyle} axisLine={false} tickLine={false} unit=" min" />
              <Tooltip contentStyle={chartStyle.contentStyle} formatter={v => [`${v} min`, "Avg Time"]} />
              <Line type="monotone" dataKey="time" stroke="#F39C12" strokeWidth={2.5} dot={{ fill: "#F39C12", r: 4 }} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-px flex-1 bg-danger/30" style={{ borderTop: "2px dashed #E74C3C" }} />
            <span className="text-xs text-danger font-semibold">15 min target</span>
          </div>
        </div>
      </div>
    </div>
  );
}
