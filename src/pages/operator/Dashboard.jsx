import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OperatorNavbar from "../../components/operator/OperatorNavbar";
import { StatusBadge, WinBadge } from "../../components/shared/Badges";
import { mockClaims } from "../../data/mockData";
import { Plus, TrendingUp, Clock, CheckCircle, AlertTriangle, Search } from "lucide-react";

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-navy">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const opClaims = mockClaims.filter(c => c.operator === user?.name);
  const filtered = opClaims.filter(c =>
    (filter === "All" || c.status === filter) &&
    (c.id.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase()))
  );

  const active = opClaims.filter(c => c.status === "Active").length;
  const won = opClaims.filter(c => c.status === "Won").length;

  return (
    <div className="min-h-screen bg-bg">
      <OperatorNavbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="font-display text-3xl text-navy">Good morning, {user?.name?.split(" ")[0]} 👋</h1>
            <p className="text-gray-500 mt-1">Here's your claims overview</p>
          </div>
          <Link
            to="/claims/new"
            className="flex items-center gap-2 bg-navy text-white px-5 py-3 rounded-xl font-semibold hover:bg-navy-light transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Claim
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard label="Active Claims" value={active} icon={AlertTriangle} color="bg-blue-50 text-blue-600" />
          <StatCard label="Won This Month" value={won} icon={CheckCircle} color="bg-emerald-50 text-emerald-600" />
          <StatCard label="Avg Response Time" value="11 min" sub="vs 8–20 hrs manual" icon={Clock} color="bg-amber-50 text-amber-600" />
        </div>

        {/* Claims Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-fade-in stagger-2">
          <div className="p-6 border-b border-gray-100 flex items-center gap-4">
            <h2 className="font-bold text-navy text-lg flex-1">Your Claims</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search claims..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20"
              />
            </div>
            <div className="flex gap-1">
              {["All", "Active", "Draft", "Won", "Lost"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    filter === f ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {["Claim ID", "Type", "Amount", "Deadline", "Win Estimate", "Status", ""].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(claim => (
                  <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-semibold text-navy">{claim.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{claim.type}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">${claim.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{claim.deadline}</td>
                    <td className="px-6 py-4"><WinBadge band={claim.winBand} /></td>
                    <td className="px-6 py-4"><StatusBadge status={claim.status} /></td>
                    <td className="px-6 py-4">
                      <Link to={`/claims/${claim.id}`} className="text-navy text-sm font-semibold hover:underline">View →</Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">No claims found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
