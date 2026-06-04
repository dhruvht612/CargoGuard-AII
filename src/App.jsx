import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RoleGuard from "./components/shared/RoleGuard";
import AdminLayout from "./components/admin/AdminLayout";

import Login from "./pages/operator/Login";
import Dashboard from "./pages/operator/Dashboard";
import NewClaim from "./pages/operator/NewClaim";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import AllClaims from "./pages/admin/AllClaims";
import Integrations from "./pages/admin/Integrations";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<RoleGuard role="operator" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/claims/new" element={<NewClaim />} />
            <Route path="/claims/:id" element={<Dashboard />} />
          </Route>

          <Route element={<RoleGuard role="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/claims" element={<AllClaims />} />
              <Route path="/admin/integrations" element={<Integrations />} />
              <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
