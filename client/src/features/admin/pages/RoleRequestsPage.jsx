import React, { useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../../shared/contexts/AuthContext";
import { getAuthorRequests, processAuthorRequest } from "../services/adminAPI.js"; 
import { approveAuthorRequest, rejectAuthorRequest } from "../services/adminAPI.js";

const RoleRequestsPage = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getAuthorRequests();
      setRequests(data);
    } catch (err) {
      setError("Neuspešno učitavanje zahteva.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const socket = io("https://backend-z574.onrender.com/");

    socket.on("new_author_request", (newRequest) => {
      setRequests((prevRequests) => [newRequest, ...prevRequests]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

 const handleApprove = async (requestId) => {
  try {
    await approveAuthorRequest(requestId);
    alert("Korisnik je uspešno postao autor!");
    setRequests(requests.filter(req => (req.id || req._id) !== requestId));
  } catch (err) {
    alert(err.message);
  }
};

const handleReject = async (requestId) => {
  if (window.confirm("Da li ste sigurni da želite da odbijete ovaj zahtev?")) {
    try {
      await rejectAuthorRequest(requestId);
      alert("Zahtev je odbijen.");
      setRequests(requests.filter(req => (req.id || req._id) !== requestId));
    } catch (err) {
      alert(err.message);
    }
  }
};

  if (loading) return <p style={{ padding: "2rem" }}>Učitavanje zahteva...</p>;
  if (error) return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem", color: "black" }}>
      <div id="welcome-message">
        <h1>Admin Panel - Zahtevi za Autore</h1>
        <p>Upravljajte zahtevima korisnika koji žele status Autora.</p>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {requests.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Korisnik ID</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Datum</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Akcije</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id || req._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{req.user_id}</td>
                  <td style={{ padding: "12px" }}>
                    {new Date(req.created_at).toLocaleDateString("sr-RS")}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "4px", 
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        backgroundColor: req.status === "pending" ? "#fff3cd" : req.status === "APPROVED" ? "#d4edda" : "#f8d7da",
                        color: req.status === "pending" ? "#856404" : req.status === "APPROVED" ? "#155724" : "#721c24"
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "right" }}>
  <button 
    onClick={() => handleApprove(req.id || req._id)}
    style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", marginRight: "5px" }}
  >
    Odobri
  </button>
  <button 
    onClick={() => handleReject(req.id || req._id)}
    style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
  >
    Odbij
  </button>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Trenutno nema aktivnih zahteva.</p>
        )}
      </div>
    </div>
  );
};

export default RoleRequestsPage;