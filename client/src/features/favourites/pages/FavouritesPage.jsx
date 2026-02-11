import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../shared/contexts/AuthContext";
import { getMyFavourites } from "../services/favouritesAPI";
import Recipe from "../../recipes/components/recipe";
import "../../recipes/components/recipes.css";

const FavouritesPage = () => {
  const { user } = useContext(AuthContext);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      const data = await getMyFavourites();

      const mapped = data.map((recipe) => ({
        ...recipe,
        is_favourite: true,
      }));

      setFavourites(mapped);
    } catch (err) {
      console.error(err);
      setError("Neuspešno učitavanje omiljenih recepata.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavourites();
    }
  }, [user]);

  if (!user) return <p>Morate biti prijavljeni.</p>;
  if (loading) return <p>Učitavanje omiljenih recepata...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "2rem", color: "black" }}>
      <h1>Moji omiljeni recepti ❤️</h1>

      <div className="recipes-grid">
        {favourites.length > 0 ? (
          favourites.map((recipe) => (
            <Recipe key={recipe._id} recipe={recipe} />
          ))
        ) : (
          <p>Nemate sačuvanih omiljenih recepata.</p>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;
