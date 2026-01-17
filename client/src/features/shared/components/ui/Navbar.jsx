import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav>
      <div>
        <Link to="/">Home</Link>

        {user && (
          <>
            <Link to="/recipes">Recipes</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/author">Author</Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/users">Users</Link>
            <Link to="/admin/role-requests">Role Requests</Link>
          </>
        )}
      </div>

      <div>
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
