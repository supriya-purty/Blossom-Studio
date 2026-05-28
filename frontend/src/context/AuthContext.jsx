import { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const readSavedUser = (newUserKey, newTokenKey, expectedRole) => {
  const saved = localStorage.getItem(newUserKey);
  if (saved) return JSON.parse(saved);

  const legacyUser = localStorage.getItem("blossomUser");
  const legacyToken = localStorage.getItem("blossomToken");
  if (!legacyUser || !legacyToken) return null;

  const parsed = JSON.parse(legacyUser);
  if (parsed.role !== expectedRole) return null;

  localStorage.setItem(newUserKey, legacyUser);
  localStorage.setItem(newTokenKey, legacyToken);
  localStorage.removeItem("blossomUser");
  localStorage.removeItem("blossomToken");
  return parsed;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return readSavedUser("blossomCustomerUser", "blossomCustomerToken", "customer");
  });
  const [adminUser, setAdminUser] = useState(() => {
    return readSavedUser("blossomAdminUser", "blossomAdminToken", "admin");
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    if (data.user.role === "admin") {
      localStorage.setItem("blossomAdminToken", data.token);
      localStorage.setItem("blossomAdminUser", JSON.stringify(data.user));
      setAdminUser(data.user);
    } else {
      localStorage.setItem("blossomCustomerToken", data.token);
      localStorage.setItem("blossomCustomerUser", JSON.stringify(data.user));
      setUser(data.user);
    }
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("blossomCustomerToken", data.token);
    localStorage.setItem("blossomCustomerUser", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("blossomCustomerToken");
    localStorage.removeItem("blossomCustomerUser");
    setUser(null);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("blossomAdminToken");
    localStorage.removeItem("blossomAdminUser");
    setAdminUser(null);
  };

  const value = useMemo(
    () => ({ user, adminUser, login, register, logout, logoutAdmin }),
    [user, adminUser]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
