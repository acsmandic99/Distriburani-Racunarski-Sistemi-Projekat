import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../shared/contexts/AuthContext";
import Recipe from "../components/recipe.jsx";
import "../components/recipes.css";
import { getRecipes } from "../services/recipesAPI.js";
import { getMyFavourites } from "../../favourites/services/favouritesAPI";

const RecipesPage = () => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);

      const [allRecipes, favouriteRecipes] = await Promise.all([
        getRecipes(),
        user ? getMyFavourites() : Promise.resolve([]),
      ]);

      console.log("All recipes:", allRecipes);
      console.log("My favourites API response:", favouriteRecipes);

      // Make sure IDs are strings
      const favouriteIds = new Set(favouriteRecipes.map((f) => String(f._id)));

      const merged = allRecipes.map((r) => ({
        ...r,
        is_favourite: favouriteIds.has(String(r._id)),
      }));

      setRecipes(merged);
    } catch (err) {
      setError("Neuspešno učitavanje recepata.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecipes();
    }
  }, [user]);

  const handleRateRecipe = (recipeId, rating) => {
    console.log(`Rating recipe ${recipeId} with ${rating}`);
  };

  if (loading) return <p>Učitavanje recepata...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "2rem", color: "black" }}>
      <div id="welcome-message">
        {user ? (
          <h1>
            Dobrodošli, {user.first_name} {user.last_name}!
          </h1>
        ) : (
          <h1>Welcome, Guest!</h1>
        )}
        <p>Pogledajte najnovije recepte naših kuvara.</p>
      </div>
      <div className="recipes-grid">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Recipe
              key={recipe._id}
              recipe={recipe}
              onRate={handleRateRecipe}
            />
          ))
        ) : (
          <p>Trenutno nema objavljenih recepata.</p>
        )}
      </div>
    </div>
  );
};

export default RecipesPage;
