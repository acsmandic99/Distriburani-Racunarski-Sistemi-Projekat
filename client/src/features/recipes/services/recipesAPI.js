import api from "../../shared/services/api/api";

export const getRecipes = async () => {
  /*
  // Zakomentarisana logika, slobodno promeniti ako treba da fituje backendu
  const response = await api.get("/api/v1/recipes");
  return response.data;
  */

  // Placeholder za sada
  return Promise.resolve([
    {
      id: 1,
      name: "Spaghetti Carbonara",
      type: "Pasta",
      prepTime: "25 min",
      difficulty: "Medium",
      servings: 2,
      ingredients: [
        "200g spaghetti",
        "100g pancetta",
        "2 eggs",
        "50g parmesan",
      ],
      steps: [
        "Boil spaghetti",
        "Cook pancetta",
        "Mix eggs and cheese",
        "Combine all",
      ],
      image: null,
      tags: ["Quick", "Italian", "Classic"],
      author: "Nikola Smoljanovic",
      authorId: 1,
    },
    {
      id: 2,
      name: "Vegan Salad",
      type: "Salad",
      prepTime: "15 min",
      difficulty: "Easy",
      servings: 1,
      ingredients: [
        "Lettuce",
        "Tomatoes",
        "Cucumber",
        "Olive oil",
        "Lemon juice",
      ],
      steps: ["Chop vegetables", "Mix dressing", "Combine all ingredients"],
      image: null,
      tags: ["Vegan", "Healthy", "Quick"],
      author: "Mihajlo Bukarica",
      authorId: 2,
    },
  ]);
};

export const getRecipeById = async (id) => {
  /*
  // Zakomentarisana logika, slobodno promeniti ako treba da fituje backendu
  const response = await api.get(`/api/v1/recipes/${id}`);
  return response.data;
  */

  const recipeId = Number(id);

  // Placeholder za sada
  return Promise.resolve({
    id: recipeId,
    name: "Spaghetti Carbonara",
    type: "Pasta",
    prepTime: "25 min",
    difficulty: "Medium",
    servings: 2,
    ingredients: ["200g spaghetti", "100g pancetta", "2 eggs", "50g parmesan"],
    steps: [
      "Boil spaghetti",
      "Cook pancetta",
      "Mix eggs and cheese",
      "Combine all",
    ],
    image: null,
    tags: ["Quick", "Italian", "Classic"],
    author: "Nikola Smoljanovic",
    authorId: 1,
  });
};
