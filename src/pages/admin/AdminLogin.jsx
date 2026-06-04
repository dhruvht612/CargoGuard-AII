import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Shield, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@cargoguard.ai");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const role = login(email, password);
    if (role === "admin") navigate("/admin");
    else setError("Invalid admin credentials. Try admin@cargoguard.ai / admin123");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5" style={{backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px"}} />

      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-3xl text-white">CargoGuard</span>
          </div>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase">Admin Portal</span>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-purple mb-1">Admin Access</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in with your administrator credentials</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple text-sm transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple/30 focus:border-purple text-sm transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple text-white py-3 rounded-xl font-semibold hover:bg-purple-dark transition-colors mt-2"
            >
              Sign In as Admin
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <Link to="/login" className="text-sm text-navy hover:text-navy-light font-medium transition-colors">
              ← Operator login
            </Link>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <strong>Demo credentials:</strong><br />
            admin@cargoguard.ai / admin123
          </div>
        </div>
      </div>
    </div>
  );
}
