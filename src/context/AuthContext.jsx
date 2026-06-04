import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    if (email === "admin@cargoguard.ai" && password === "admin123") {
      setUser({ name: "Admin User", email, role: "admin" });
      return "admin";
    }
    if (email === "operator@cargoguard.ai" && password === "operator123") {
      setUser({ name: "Alex Rivera", email, role: "operator", company: "TransNorth Fleet" });
      return "operator";
    }
    return null;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
