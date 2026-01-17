import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../shared/contexts/AuthContext";
import { requestAuthorRole } from "../services/usersAPI";
import { addRecipe } from "../../recipes/services/recipesAPI";
import RecipeForm from "../../recipes/components/RecipeForm";
import { useNavigate } from "react-router-dom";
import "../components/Author.css";

const AuthorPage = () => {
  const { user, setUser, fetchMe } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Refresh user info from backend on page load
    fetchMe();
  }, []);

  if (!user) return null;

  const isAuthor = user.role === "author";

  const canRequest = !isAuthor && !user.author_request_pending;

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

  const handleAddRecipe = async (data, image) => {
    try {
      await addRecipe(data, image);
      alert("Recipe added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add recipe: " + (err.message || "Unknown error"));
    }
  };

  return (
    <div className="author-page">
      <div className="author-container">
        <h1>Author Dashboard</h1>

        {!isAuthor ? (
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
            <p>Welcome, author! Fill in the form below to add a new recipe:</p>
            <RecipeForm onSubmit={handleAddRecipe} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorPage;
