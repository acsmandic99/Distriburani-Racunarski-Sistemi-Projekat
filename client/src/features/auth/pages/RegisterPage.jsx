import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import { registerUser } from "../services/authAPI";
import { useNavigate, Link } from "react-router-dom";
import "../components/Auth.css";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (formData) => {
    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Register</h1>
        {error && <p className="auth-error">{error}</p>}
        <RegisterForm onSubmit={handleRegister} />
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
