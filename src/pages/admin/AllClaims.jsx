import { useState } from "react";
import { Link } from "react-router-dom";
import { mockClaims } from "../../data/mockData";
import { StatusBadge, WinBadge } from "../../components/shared/Badges";
import { Search, Download, AlertTriangle } from "lucide-react";

export default function AllClaims() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [bandFilter, setBandFilter] = useState("All");

  const filtered = mockClaims.filter(c =>
    (typeFilter === "All" || c.type === typeFilter) &&
    (statusFilter === "All" || c.status === statusFilter) &&
    (bandFilter === "All" || c.winBand === bandFilter) &&
    (c.id.toLowerCase().includes(search.toLowerCase()) ||
     c.operator.toLowerCase().includes(search.toLowerCase()) ||
     c.company.toLowerCase().includes(search.toLowerCase()))
  );

  const totalValue = filtered.reduce((s, c) => s + c.amount, 0);
  const overdue = filtered.filter(c => new Date(c.deadline) < new Date() && c.status === "Active").length;

  const types = ["All", ...new Set(mockClaims.map(c => c.type))];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl text-navy">All Claims</h1>
          <p className="text-gray-500 mt-1">Every claim across all operators</p>
        </div>
        <button className="flex items-center gap-2 border border-navy text-navy px-5 py-3 rounded-xl font-semibold hover:bg-navy/5 transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Filtered Claims", value: filtered.length },
          { label: "Total Value", value: `$${totalValue.toLocaleString()}` },
          { label: "Overdue", value: overdue, warn: overdue > 0 },
        ].map(({ label, value, warn }) => (
          <div key={label} className={`rounded-xl px-5 py-4 flex items-center justify-between ${warn ? "bg-red-50 border border-red-200" : "bg-white border border-gray-100"} shadow-sm animate-fade-in`}>
            <span className="text-sm text-gray-500">{label}</span>
            <span className={`font-bold text-xl ${warn ? "text-danger" : "text-navy"}`}>{value}</span>
            {warn && <AlertTriangle className="w-4 h-4 text-danger" />}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-4 flex flex-wrap items-center gap-3 animate-fade-in stagger-1">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by claim ID, operator, company..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === t ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-100"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {["All", "Strong", "Moderate", "Weak"].map(b => (
            <button key={b} onClick={() => setBandFilter(b)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${bandFilter === b ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-100"}`}>
              {b}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {["All", "Active", "Draft", "Submitted", "Won", "Lost"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter === s ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-100"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 animate-fade-in stagger-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Claim ID", "Operator", "Company", "Type", "Amount", "Deadline", "Win Band", "Status", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(claim => (
                <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-mono text-sm font-semibold text-navy">{claim.id}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{claim.operator}</td>
                  <td className="px-5 py-4 text-sm text-gray-500">{claim.company}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{claim.type}</td>
                  <td className="px-5 py-4 text-sm font-semibold">${claim.amount.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{claim.deadline}</td>
                  <td className="px-5 py-4"><WinBadge band={claim.winBand} /></td>
                  <td className="px-5 py-4"><StatusBadge status={claim.status} /></td>
                  <td className="px-5 py-4">
                    <Link to={`/admin/claims/${claim.id}`} className="text-purple text-sm font-semibold hover:underline">Inspect →</Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-400 text-sm">No claims match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
