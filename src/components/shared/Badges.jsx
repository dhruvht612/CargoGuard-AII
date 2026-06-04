export function StatusBadge({ status }) {
  const map = {
    Active: "bg-blue-100 text-blue-700",
    Draft: "bg-gray-100 text-gray-600",
    Submitted: "bg-amber-100 text-amber-700",
    Won: "bg-emerald-100 text-emerald-700",
    Lost: "bg-red-100 text-red-700",
    Suspended: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

export function WinBadge({ band }) {
  const map = {
    Strong: "bg-emerald-100 text-emerald-700",
    Moderate: "bg-amber-100 text-amber-700",
    Weak: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[band] || "bg-gray-100 text-gray-600"}`}>
      {band}
    </span>
  );
}

export function RoleBadge({ role }) {
  const map = {
    Admin: "bg-purple-100 text-purple-700",
    Manager: "bg-blue-100 text-blue-700",
    Operator: "bg-gray-100 text-gray-700",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[role] || "bg-gray-100 text-gray-600"}`}>
      {role}
    </span>
  );
}
