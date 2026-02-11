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

  const isAuthor = user.role === "author" || user.role === "admin";

  const canRequest = !isAuthor && !user.author_request_pending;

  const handleRequestAuthor = async () => {
    if (!canRequest) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await requestAuthorRole();
      if (res.message == "Role already requested")
        setMessage("Već ste zatražili ulogu autora");
      else setMessage("Uspešno poslat zahtev");

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
      alert("Uspešno dodat recept!");
    } catch (err) {
      console.error(err);
      alert(
        "Greška pri dodavanju recepta: " + (err.message || "Unknown error"),
      );
    }
  };

  return (
    <div className="author-page">
      <div className="author-container">
        <h1>Autor Dashboard</h1>

        {!isAuthor ? (
          <div className="author-info">
            <p>Morate biti autor da bi ste dodavali nove recepte</p>
            <button
              onClick={handleRequestAuthor}
              disabled={!canRequest || loading}
              className={!canRequest ? "disabled" : ""}
            >
              {loading
                ? "Zahteva se..."
                : canRequest
                  ? "Zatraži ulogu autora"
                  : "Zahtev u obradi"}
            </button>
            {message && <p className="message">{message}</p>}
          </div>
        ) : (
          <div className="author-info">
            <p>Dobrodosli! Ispunite formu da dodate novi recept:</p>
            <RecipeForm onSubmit={handleAddRecipe} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorPage;
