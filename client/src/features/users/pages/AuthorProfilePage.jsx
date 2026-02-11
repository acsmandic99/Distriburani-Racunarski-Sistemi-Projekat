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
        const data = response; // `response` is already response.data.data from usersAPI
        setAuthor(data); // data contains all author info
        setRecipes(data.recipes || []);
      } catch (err) {
        console.error("Failed to load author profile", err);
      }
    };

    fetchAuthor();
  }, [authorId]);

  if (!author) return <p>Loading...</p>;

  return (
    <div className="author-page">
      <div className="author-container">
        <h1>
          {author.first_name} {author.last_name}
        </h1>

        <div className="author-info">
          <p>
            <strong>Total Recipes:</strong> {author.total_recipes}
          </p>
          <p>
            <strong>Average Rating:</strong> {author.average_rating.toFixed(2)}
          </p>
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
