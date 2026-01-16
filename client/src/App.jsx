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
import { RecipesPage, RecipeDetailsPage } from "./features/recipes";
import { AdminUsersPage, RoleRequestsPage } from "./features/admin";
import { ProfilePage } from "./features/users";
import ProtectedRoute from "./features/shared/components/ProtectedRoute";
import { setAuthToken } from "./features/auth/services/authAPI";

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/recipes" /> : <Navigate to="/login" />}
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/role-requests" element={<RoleRequestsPage />} />
      </Route>
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
