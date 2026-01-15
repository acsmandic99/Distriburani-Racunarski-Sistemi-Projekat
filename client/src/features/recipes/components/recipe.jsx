import React, { useState } from "react";

const Recipe = ({ recipe, onRate }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const handleRate = (rating) => {
    setUserRating(rating);
    onRate(recipe.id, rating);
  };

  const displayRating = recipe.totalRatings > 0 
    ? (recipe.rating / recipe.totalRatings).toFixed(1) 
    : "Nema ocena";

  return (
    <div className="recipe-card">
      <img 
        src={recipe.image} 
        alt={recipe.title}
        className="recipe-image"
      />
      
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        <p className="recipe-description">{recipe.description}</p>
        
        <div className="recipe-info">
          <div className="info-item">
            <span>{recipe.prepTime} min</span>
          </div>
          <div className="info-item">
            <span>{recipe.servings} osobe</span>
          </div>
        </div>

        <div className="recipe-rating-section">
          <div className="rating-display">
            <span>Prosecna ocena:</span>
            <span className="rating-value">
              {displayRating} {recipe.totalRatings > 0 && `(${recipe.totalRatings})`}
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
                  <span className={
                    (hoveredStar || userRating) >= star 
                      ? "star star-filled" 
                      : "star star-empty"
                  }>
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
            <p>{recipe.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recipe;