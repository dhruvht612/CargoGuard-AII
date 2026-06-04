import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RoleGuard({ role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />;
  if (user.role !== role) return <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />;
  return <Outlet />;
}
