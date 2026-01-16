import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipeById } from "../services/recipesAPI";
import { AuthContext } from "../../shared/contexts/AuthContext";
import "./RecipeDetailsPage.css";

export const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleEdit = () => {
    // Placeholder za sada
    console.log("Edit recipe:", recipe.id);
    // navigate(`/recipes/${recipe.id}/edit`);
  };

  const handleDelete = () => {
    // Placeholder za sada
    console.log("Delete recipe:", recipe.id);
    // Dodati API call ka backendu
  };

  if (loading) return <p>Loading recipe...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  const isAuthor = user && recipe.authorId === user.id; // Promeniti ako treba da odgovara backendu

  return (
    <div className="recipe-details-page">
      <h1>{recipe.name}</h1>
      <p>
        <strong>Type:</strong> {recipe.type}
      </p>
      <p>
        <strong>Prep time:</strong> {recipe.prepTime}
      </p>
      <p>
        <strong>Difficulty:</strong> {recipe.difficulty}
      </p>
      <p>
        <strong>Servings:</strong> {recipe.servings}
      </p>
      <p>
        <strong>Author:</strong> {recipe.author}
      </p>

      <img
        src={recipe.image || "/placeholder-recipe.png"}
        alt={recipe.name}
        className="recipe-image"
      />

      {recipe.tags && recipe.tags.length > 0 && (
        <p>
          <strong>Tags:</strong> {recipe.tags.join(", ")}
        </p>
      )}

      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h2>Steps</h2>
      <ol>
        {recipe.steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>

      {isAuthor && (
        <div className="recipe-actions">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
            Delete
          </button>
        </div>
      )}

      <div className="recipe-comments">
        <h3>Comments / Ratings (placeholder)</h3>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
