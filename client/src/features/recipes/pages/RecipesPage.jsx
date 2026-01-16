import React, { useEffect, useState } from "react";
import { getRecipes } from "../services/recipesAPI";
import RecipeCard from "../components/RecipeCard";
import "./RecipesPage.css";

export const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (err) {
        console.error("Failed to fetch recipes", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p>Loading recipes...</p>;
  if (recipes.length === 0) return <p>No recipes found.</p>;

  return (
    <div className="recipes-page">
      <h1>Recipes</h1>
      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;
