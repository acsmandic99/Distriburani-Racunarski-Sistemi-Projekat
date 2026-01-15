import React, { useState, useContext } from "react";
import LoginForm from "../components/LoginForm";
import { loginUser, setAuthToken } from "../services/authAPI";
import { AuthContext } from "../../shared/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../components/Auth.css";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await loginUser(email, password);

      const token = response.data.access_token;
      login(token);
      navigate("/recipes");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid email or password"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login</h1>
        {error && <p className="auth-error">{error}</p>}
        <LoginForm onSubmit={handleLogin} />
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
