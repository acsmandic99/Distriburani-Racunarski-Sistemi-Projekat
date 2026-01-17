import { createContext, useState, useEffect } from "react";
import api from "../services/api/api";
import { setAuthToken } from "../../auth/services/authAPI";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));



  const login = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = async () => {
    try {
      await api.post("/api/v1/auth/logout"); // blocklist token
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    setAuthToken(null);
  };

  const fetchMe = async () => {
    try {
      const res = await api.get("/api/v1/auth/me");
      setUser(res.data.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  useEffect(() => {
    if (!token) return;
    setAuthToken(token);
    fetchMe();
  }, [token]);


  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
