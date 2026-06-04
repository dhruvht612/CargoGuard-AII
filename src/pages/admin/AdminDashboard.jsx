import { mockClaims, mockAnalytics } from "../../data/mockData";
import { StatusBadge, WinBadge } from "../../components/shared/Badges";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { FileText, Users, TrendingUp, DollarSign } from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, color, border }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border ${border || "border-gray-100"} animate-fade-in`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-3xl font-bold text-navy">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const totalValue = mockClaims.reduce((s, c) => s + c.amount, 0);
  const active = mockClaims.filter(c => c.status === "Active").length;
  const won = mockClaims.filter(c => c.status === "Won").length;
  const winRate = Math.round((won / mockClaims.length) * 100);

  return (
    <div className="p-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-display text-3xl text-navy">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview — all companies</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Claims" value={mockClaims.length} icon={FileText} color="bg-blue-50 text-blue-600" />
        <StatCard label="Active Claims" value={active} icon={FileText} color="bg-amber-50 text-amber-600" />
        <StatCard label="Win Rate (30d)" value={`${winRate}%`} icon={TrendingUp} color="bg-emerald-50 text-emerald-600" border="border-emerald-100" />
        <StatCard label="Total Claims Value" value={`$${(totalValue / 1000).toFixed(0)}K`} icon={DollarSign} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in stagger-1">
          <h3 className="font-bold text-navy mb-4">Claims Volume Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockAnalytics.claimsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
              <Line type="monotone" dataKey="claims" stroke="#1A3C5E" strokeWidth={2.5} dot={{ fill: "#1A3C5E", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in stagger-2">
          <h3 className="font-bold text-navy mb-4">Win Rate by Claim Type</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockAnalytics.winRateByType} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="type" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} formatter={(v) => [`${v}%`, "Win Rate"]} />
              <Bar dataKey="rate" fill="#2ECC71" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-fade-in stagger-3">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-navy">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {["Claim ID", "Operator", "Company", "Type", "Amount", "Win Band", "Status"].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockClaims.map(claim => (
                <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-semibold text-navy">{claim.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{claim.operator}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{claim.company}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{claim.type}</td>
                  <td className="px-6 py-4 text-sm font-semibold">${claim.amount.toLocaleString()}</td>
                  <td className="px-6 py-4"><WinBadge band={claim.winBand} /></td>
                  <td className="px-6 py-4"><StatusBadge status={claim.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
