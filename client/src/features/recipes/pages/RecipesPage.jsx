import React, { useContext, useState, useEffect } from "react"; // Dodat useEffect
import { AuthContext } from "../../shared/contexts/AuthContext";
import Recipe from "../components/recipe.jsx";
import "../components/recipes.css";
import axios from "axios";

const RecipesPage = () => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/v1/recipes");

      if (response.data.success) {
        setRecipes(response.data.data);
      }
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

  const handleRateRecipe = (recipeId, rating) => {
    console.log(`Rating recipe ${recipeId} with ${rating}`);
  };

  if (loading) return <p>Učitavanje recepata...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "2rem", color: "black" }}>
      <div id="welcome-message">
        {/* 2. Uslovno prikazivanje poruke dobrodošlice */}
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
        {" "}
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
