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
        {user && (
          <>
            <Link to="/recipes">Recepti</Link>
            <Link to="/favourites">Omiljeni</Link>
            <Link to="/profile">Profil</Link>
            <Link to="/author">Autor</Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/users">Korisnici</Link>
            <Link to="/admin/role-requests">Zahtevi Uloge</Link>
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
