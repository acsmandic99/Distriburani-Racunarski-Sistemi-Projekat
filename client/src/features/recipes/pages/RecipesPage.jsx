import React, { useContext } from "react";
import { AuthContext } from "../../shared/contexts/AuthContext";

const RecipesPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div style={{ padding: "2rem", color: "black" }}>
      <h1>
        Welcome, {user.first_name} {user.last_name}!
      </h1>
      <p>This is the placeholder for the recipes page.</p>
    </div>
  );
};

export default RecipesPage;
