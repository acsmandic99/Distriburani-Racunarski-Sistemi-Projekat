import React, { useContext, useState } from "react";
import { AuthContext } from "../../shared/contexts/AuthContext";
import Recipe from "../components/recipe.jsx";
import "../components/recipes.css";

const PLACEHOLDER_RECIPES = [
  {
    id: 1,
    title: "Pasta Carbonara",
    description: "Tradicionalna italijanska pasta",
    image: "",
    prepTime: 20,
    servings: 4,
    rating: 0,
    totalRatings: 0,
    ingredients: ["500g spagete", "200g slanine", "4 jaja", "100g parmezana", "So i biber"],
    instructions: "Skuvaj pastu, isprzi slaninu, izmesaj sa jajima i sirom..."
  },
  {
     id: 2,
    title: "Cokoladni kolac",
    description: "Najcokoladniji kolac ikada",
    image: "",
    prepTime: 45,
    servings: 8,
    rating: 0,
    totalRatings: 0,
    ingredients: ["200g cokolade", "150g brasna", "3 jaja", "100g secera"],
    instructions: "Istopi cokoladu, sjedini sastojke, peci na 180C..."
  },
  {
    id: 3,
    title: "Grcka salata",
    description: "Osvezavajuca salata sa fetom i maslinama",
    image: "",
    prepTime: 15,
    servings: 4,
    rating: 0,
    totalRatings: 0,
    ingredients: ["2 paradajza", "1 krastavac", "200g feta sira", "Masline"],
    instructions: "Iseckaj povrce, dodaj fetu i masline..."
  }
  ];

const RecipesPage = () => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState(PLACEHOLDER_RECIPES);

  const handleRateRecipe = (recipeId, rating) => {
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe.id === recipeId
          ? {
              ...recipe,
              rating: recipe.rating + rating,
              totalRatings: recipe.totalRatings + 1
            }
          : recipe
      )
    );
  };

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div style={{ padding: "2rem", color: "black" }}>
      <div id="welcome-message">
        <h1>
          Welcome, {user.first_name} {user.last_name}!
        </h1>
        <p>This is the placeholder for the recipes page.</p>
      </div>
      <div className="recipes-grid">
        {recipes.map(recipe => (
          <Recipe 
            key={recipe.id} 
            recipe={recipe} 
            onRate={handleRateRecipe}
          />
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;
