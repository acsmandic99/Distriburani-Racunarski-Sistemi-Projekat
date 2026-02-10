import { createContext, useState, useEffect } from "react";
import api from "../services/api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const login = async (accessToken) => {
    if (!accessToken) {
      console.error("No access token provided to login!");
      return;
    }

    localStorage.setItem("token", accessToken);
    setToken(accessToken);

    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    await fetchMe();
  };

  const logout = async () => {
    try {
      await api.post("/api/v1/auth/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  const fetchMe = async () => {
    if (!token) return;

    try {
      const res = await api.get("/api/v1/auth/me");
      setUser(res.data.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    if (token && token !== "undefined") {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchMe();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};
