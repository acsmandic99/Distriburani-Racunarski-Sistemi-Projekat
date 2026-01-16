import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../shared/contexts/AuthContext";
import "./RecipeDetailsPage.css";

export const RecipeDetailsPage = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Get recipe from Router state
  const recipe = location.state?.recipe;

  if (!recipe) return <p>Recipe not found.</p>;

  const isAuthor = user && recipe.authorId === user.id;

  return (
    <div className="recipe-details-page">
      <h1>{recipe.title}</h1>
      <p>
        <strong>Type:</strong> {recipe.type_of_dish}
      </p>
      <p>
        <strong>Prep time:</strong> {recipe.time_for_preperation}
      </p>
      <p>
        <strong>Difficulty:</strong> {recipe.difficulty}
      </p>
      <p>
        <strong>Servings:</strong> {recipe.number_of_people}
      </p>
      <p>
        <strong>Author:</strong> {recipe.author.first_name}{" "}
        {recipe.author.last_name}
      </p>

      <img
        src={recipe.image_url || "/placeholder-recipe.png"}
        alt={recipe.title}
        className="recipe-image"
      />

      {recipe.additional_marks?.length > 0 && (
        <p>
          <strong>Tags:</strong> {recipe.additional_marks.join(", ")}
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
          <button>Edit</button>
          <button style={{ marginLeft: "10px" }}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default RecipeDetailsPage;
