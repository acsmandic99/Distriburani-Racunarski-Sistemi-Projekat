import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Recipe = ({ recipe, onRate }) => {
  const navigate = useNavigate();
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const handleRate = (rating) => {
    setUserRating(rating);
    onRate(recipe.id, rating);
  };

  const displayRating =
    recipe.total_recipe_ratings > 0
      ? recipe.average_rating.toFixed(1)
      : "Nema ocena";

  const handleNavigateToDetails = () => {
    navigate(`/recipes/${recipe._id}`, { state: { recipe } });
  };

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
            <span>{recipe.time_for_preperation} </span>
          </div>
          <div className="info-item">
            <span>{recipe.number_of_people} osobe</span>
          </div>
        </div>
        <div className="recipe-author">
          <Link to={`/author/${recipe.author.author_id}`}>
            Author: {recipe.author.first_name} {recipe.author.last_name}
          </Link>
        </div>
        <div className="recipe-rating-section">
          <div className="rating-display">
            <span>Prosecna ocena:</span>
            <span className="rating-value">
              {displayRating}{" "}
              {recipe.total_recipe_ratings > 0 &&
                `(${recipe.total_recipe_ratings})`}
            </span>
          </div>

          <div className="rating-input">
            <span>Tvoja ocena:</span>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="star-button"
                >
                  <span
                    className={
                      (hoveredStar || userRating) >= star
                        ? "star star-filled"
                        : "star star-empty"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="details-button"
        >
          {showDetails ? "Sakrij detalje" : "Prikazi detalje"}
        </button>

        {showDetails && (
          <div className="recipe-details">
            <h4>Sastojci:</h4>
            <ul>
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>

            <h4>Priprema:</h4>
            <ul>
              {recipe.steps.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipe;
