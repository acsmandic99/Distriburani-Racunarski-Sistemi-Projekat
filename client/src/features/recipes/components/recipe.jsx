import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toggleFavourite } from "../../favourites/services/favouritesAPI";

const Recipe = ({ recipe, onRate }) => {
  const navigate = useNavigate();

  const [userRating, setUserRating] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [isFavourite, setIsFavourite] = useState(recipe.is_favourite ?? false);

  useEffect(() => {
    setIsFavourite(recipe.is_favourite ?? false);
  }, [recipe.is_favourite]);

  const displayRating =
    recipe.total_recipe_ratings > 0
      ? recipe.average_rating.toFixed(1)
      : "Nema ocena";

  const handleNavigateToDetails = () => {
    navigate(`/recipes/${recipe._id}`, { state: { recipe } });
  };

  const handleRate = (rating) => {
    setUserRating(rating);
    if (onRate) onRate(recipe._id, rating);
  };

  const handleToggleFavourite = async (e) => {
    e.stopPropagation();
    try {
      const res = await toggleFavourite(recipe._id);
      setIsFavourite(res.action === "added");
    } catch (err) {
      console.error("Failed to toggle favourite", err);
    }
  };

  console.log("Recipe:", recipe._id, "is_favourite:", recipe.is_favourite);
  const baseUrl = "http://localhost:5000";
  return (
    <div className="recipe-card">
      <img
        src={recipe.image_url}
        alt={recipe.title}
        className="recipe-image"
        onClick={handleNavigateToDetails}
      />

      <div className="recipe-content">
        <h3 className="recipe-title" onClick={handleNavigateToDetails}>
          {recipe.title}
        </h3>
        <p className="recipe-description">
          {recipe.type_of_dish} • {recipe.difficulty}
        </p>

        <div className="recipe-info">
          <div className="info-item">
            <span>{recipe.time_for_preperation}</span>
          </div>
          <div className="info-item">
            <span>{recipe.number_of_people} osobe</span>
          </div>
        </div>

        <div className="recipe-author">
          <Link to={`/author/${recipe.author.author_id}`}>
            Autor: {recipe.author.first_name} {recipe.author.last_name}
          </Link>
        </div>

        <div className="recipe-rating-section">
          <div className="rating-display">
            <span>Prosečna ocena:</span>
            <span className="rating-value">
              {displayRating}{" "}
              {recipe.total_recipe_ratings > 0 &&
                `(${recipe.total_recipe_ratings})`}
            </span>
          </div>

          <div className="rating-input">
            <button
              className="favourite-button"
              onClick={handleToggleFavourite}
              title={
                isFavourite ? "Remove from favourites" : "Add to favourites"
              }
            >
              {isFavourite ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
