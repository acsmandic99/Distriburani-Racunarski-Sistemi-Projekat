import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../shared/contexts/AuthContext";
import "./RecipeDetailsPage.css";

const RecipeDetailsPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { recipe } = location.state || {};

  if (!recipe) return <p>Recipe not found.</p>;

  const handleEdit = () => {
    console.log("Edit recipe:", recipe._id);
  };

  const handleDelete = () => {
    console.log("Delete recipe:", recipe._id);
  };

  const isAuthor =
    user && recipe.author && recipe.author.first_name === user.first_name;

  return (
    <div className="recipe-details-page">
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        &larr; Back
      </button>

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

      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="recipe-image"
        />
      )}

      {recipe.additional_marks && recipe.additional_marks.length > 0 && (
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
