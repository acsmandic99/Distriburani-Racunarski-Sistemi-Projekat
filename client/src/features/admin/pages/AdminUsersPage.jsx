import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../shared/contexts/AuthContext";
import { getAllUsers, deleteUser } from "../services/adminAPI.js"; 

const UsersManagementPage = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError("Neuspešno učitavanje korisnika.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovog korisnika?")) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(u => (u.id || u._id) !== userId));
      } catch (err) {
        alert("Greška pri brisanju korisnika.");
      }
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>Učitavanje korisnika...</p>;
  if (error) return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem", color: "black" }}>
      <div id="welcome-message">
        <h1>Admin Panel - Upravljanje Korisnicima</h1>
        <p>Pregled svih registrovanih korisnika u sistemu.</p>
      </div>

      <div style={{ marginTop: "2rem", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "12px", textAlign: "left" }}>Avatar</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Ime i Prezime</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Uloga</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id || u._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>
                  <img 
                    src={u.profile_picture || "/static/uploads/profile-images/default-avatar.jpg"} 
                    alt="avatar" 
                    style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover", border: "1px solid #ddd" }}
                  />
                </td>
                <td style={{ padding: "12px", fontWeight: "500" }}>
                  {u.first_name} {u.last_name}
                </td>
                <td style={{ padding: "12px", color: "#666" }}>{u.email}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{ 
                    padding: "4px 8px", 
                    borderRadius: "4px", 
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    backgroundColor: u.role === "admin" ? "#f8d7da" : u.role === "AUTHOR" ? "#d1ecf1" : "#e2e3e5",
                    color: u.role === "admin" ? "#721c24" : u.role === "AUTHOR" ? "#0c5460" : "#383d41"
                  }}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "12px", textAlign: "right" }}>
                  {/* Admin ne može da obriše sam sebe */}
                  {(currentUser?.id !== (u.id || u._id)) && (
                    <button 
                      onClick={() => handleDelete(u.id || u._id)}
                      style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Obriši
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManagementPage;