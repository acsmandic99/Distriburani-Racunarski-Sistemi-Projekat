import React from "react";
import { Link } from "react-router-dom";
import "./RecipeCard.css";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <h3>{recipe.title}</h3>
      <p>Type: {recipe.type_of_dish}</p>
      <p>Prep time: {recipe.time_for_preperation}</p>
      <Link to={`/author/${recipe.author.author_id}`}>
        Author: {recipe.author.first_name} {recipe.author.last_name}
      </Link>
      <Link to={`/recipes/${recipe._id}`} state={{ recipe }}>
        View details
      </Link>
    </div>
  );
};

export default RecipeCard;
