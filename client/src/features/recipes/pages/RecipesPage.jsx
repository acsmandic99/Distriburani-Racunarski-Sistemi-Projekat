import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../shared/contexts/AuthContext";
import RecipeCard from "../components/RecipeCard";
import "../components/recipes.css";
import { getRecipes } from "../services/recipesAPI";

const RecipesPage = () => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await getRecipes();
      console.log("Recipes response:", data);
      setRecipes(data);
    } catch (err) {
      setError("Neuspešno učitavanje recepata.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  if (loading) return <p>Učitavanje recepata...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "2rem", color: "black" }}>
      <div id="welcome-message">
        {user ? (
          <h1>
            Welcome, {user.first_name} {user.last_name}!
          </h1>
        ) : (
          <h1>Welcome, Guest!</h1>
        )}
        <p>Pogledajte najnovije recepte naših kuvara.</p>
      </div>

      <div className="recipes-grid">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))
        ) : (
          <p>Trenutno nema objavljenih recepata.</p>
        )}
      </div>
    </div>
  );
};

export default RecipesPage;
