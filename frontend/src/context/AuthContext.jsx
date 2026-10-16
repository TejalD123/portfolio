import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("td-admin-token"));
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("td-admin-info");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (newToken, adminInfo) => {
    localStorage.setItem("td-admin-token", newToken);
    localStorage.setItem("td-admin-info", JSON.stringify(adminInfo));
    setToken(newToken);
    setAdmin(adminInfo);
  };

  const logout = () => {
    localStorage.removeItem("td-admin-token");
    localStorage.removeItem("td-admin-info");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
