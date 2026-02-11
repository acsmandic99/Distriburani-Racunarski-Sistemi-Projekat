import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthorProfile } from "../services/usersAPI";
import "../components/AuthorProfile.css";

const AuthorProfilePage = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authorId) return;
    const fetchAuthor = async () => {
      try {
        const response = await getAuthorProfile(authorId);
        const data = response;
        setAuthor(data);
        setRecipes(data.recipes || []);
      } catch (err) {
        console.error("Failed to load author profile", err);
      }
    };
    fetchAuthor();
  }, [authorId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!author) return <p>Loading...</p>;

  return (
    <div className="author-page">
      <div className="author-container">
        <div className="author-header">
          <h1>
            {author.first_name} {author.last_name}
          </h1>
          <p className="author-location">
            {author.city && author.country
              ? `${author.city}, ${author.country}`
              : author.country || "Location not specified"}
          </p>
        </div>

        <div className="author-details">
          <div className="detail-card">
            <span className="detail-label">Member Since</span>
            <span className="detail-value">
              {formatDate(author.created_at)}
            </span>
          </div>
          <div className="detail-card">
            <span className="detail-label">Total Recipes</span>
            <span className="detail-value">{author.total_recipes || 0}</span>
          </div>
          <div className="detail-card">
            <span className="detail-label">Average Rating</span>
            <span className="detail-value">
              {author.average_rating
                ? `⭐ ${author.average_rating.toFixed(2)}`
                : "No ratings yet"}
            </span>
          </div>
          <div className="detail-card">
            <span className="detail-label">Gender</span>
            <span className="detail-value">{author.gender || "Male"}</span>
          </div>
        </div>

        <div className="recipes-section">
          <h2>Recipes by {author.first_name}</h2>
          {recipes.length === 0 && <p>No recipes yet.</p>}
          <div className="recipe-list">
            {recipes.map((r) => (
              <div
                key={r._id}
                className="recipe-card"
                onClick={() => navigate(`/recipes/${r._id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={
                    r.image_url || "/static/uploads/recipes/default-recipe.jpg"
                  }
                  alt={r.title}
                />
                <div className="recipe-details">
                  <h3>{r.title}</h3>
                  <p>Difficulty: {r.difficulty}</p>
                  <p>Serves: {r.number_of_people}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfilePage;
