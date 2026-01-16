import React, { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  AuthProvider,
  AuthContext,
} from "./features/shared/contexts/AuthContext";
import Navbar from "./features/shared/components/ui/Navbar";
import { LoginPage, RegisterPage } from "./features/auth";
import { RecipesPage } from "./features/recipes";
import { setAuthToken } from "./features/auth/services/authAPI";

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/recipes" /> : <Navigate to="/recipes" />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/recipes" element={<RecipesPage />} />
    </Routes>
  );
}

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setAuthToken(token);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
