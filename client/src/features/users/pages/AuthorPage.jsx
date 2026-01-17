import React, { useContext, useState } from "react";
import { AuthContext } from "../../shared/contexts/AuthContext";
import { requestAuthorRole } from "../services/usersAPI";
import { useNavigate } from "react-router-dom";
import "../components/Author.css";

const AuthorPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  if (!user) return null;

  const canRequest = !user.is_author && !user.author_request_pending;

  const handleRequestAuthor = async () => {
    if (!canRequest) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await requestAuthorRole();
      setMessage(res.message || "Request submitted successfully!");

      // Update user context to reflect pending request
      setUser((prev) => ({ ...prev, author_request_pending: true }));
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="author-page">
      <div className="author-container">
        <h1>Author Dashboard</h1>

        {!user.is_author ? (
          <div className="author-info">
            <p>You cannot post recipes without being an author.</p>
            <button
              onClick={handleRequestAuthor}
              disabled={!canRequest || loading}
              className={!canRequest ? "disabled" : ""}
            >
              {loading
                ? "Requesting..."
                : canRequest
                  ? "Request Author Role"
                  : "Request Pending"}
            </button>
            {message && <p className="message">{message}</p>}
          </div>
        ) : (
          <div className="author-info">
            <p>Welcome, author! You can now post new recipes.</p>
            <button onClick={() => navigate("/recipes/new")}>
              Add New Recipe
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorPage;
