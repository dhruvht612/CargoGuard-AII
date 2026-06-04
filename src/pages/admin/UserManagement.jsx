import { useState } from "react";
import { mockUsers } from "../../data/mockData";
import { StatusBadge, RoleBadge } from "../../components/shared/Badges";
import { Search, UserPlus, MoreVertical, Shield, UserX, RefreshCw, Trash2 } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Operator");

  const filtered = users.filter(u =>
    (roleFilter === "All" || u.role === roleFilter) &&
    (statusFilter === "All" || u.status === statusFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
     u.email.toLowerCase().includes(search.toLowerCase()) ||
     u.company.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSuspend = (id) => {
    setUsers(us => us.map(u => u.id === id
      ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
      : u
    ));
    setMenuOpen(null);
  };

  const deleteUser = (id) => {
    setUsers(us => us.filter(u => u.id !== id));
    setMenuOpen(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-display text-3xl text-navy">User Management</h1>
          <p className="text-gray-500 mt-1">{users.length} users across all companies</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 bg-purple text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-dark transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-4 flex items-center gap-4 animate-fade-in stagger-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple/20"
          />
        </div>
        <div className="flex gap-1">
          {["All", "Admin", "Manager", "Operator"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${roleFilter === r ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-100"}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {["All", "Active", "Suspended"].map(s => (
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
                {["User", "Company", "Role", "Claims", "Joined", "Status", ""].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors relative">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.company}</td>
                  <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-700">{user.claims}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.joined}</td>
                  <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                  <td className="px-6 py-4 relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    {menuOpen === user.id && (
                      <div className="absolute right-6 top-12 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 w-44 animate-fade-in">
                        <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Shield className="w-3.5 h-3.5 text-purple" /> Edit Role
                        </button>
                        <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <RefreshCw className="w-3.5 h-3.5 text-blue-500" /> Reset Password
                        </button>
                        <button onClick={() => toggleSuspend(user.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <UserX className="w-3.5 h-3.5 text-amber" />
                          {user.status === "Active" ? "Suspend" : "Reactivate"}
                        </button>
                        <div className="my-1 border-t border-gray-100" />
                        <button onClick={() => deleteUser(user.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowInvite(false)}>
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-navy text-xl mb-1">Invite User</h3>
            <p className="text-gray-500 text-sm mb-6">They'll receive an email with login instructions</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                  placeholder="user@company.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple/20">
                  <option>Operator</option>
                  <option>Manager</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowInvite(false)}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => { alert(`Invite sent to ${inviteEmail}`); setShowInvite(false); }}
                className="flex-1 bg-purple text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-purple-dark">
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
