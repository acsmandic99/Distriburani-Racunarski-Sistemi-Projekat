import React from "react";
import { Link } from "react-router-dom";
import "./RecipeCard.css";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <h3>{recipe.name}</h3>
      <p>Type: {recipe.type}</p>
      <p>Prep time: {recipe.prepTime}</p>
      <p>Author: {recipe.author}</p>
      <Link to={`/recipes/${recipe.id}`}>View details</Link>
    </div>
  );
};

export default RecipeCard;
