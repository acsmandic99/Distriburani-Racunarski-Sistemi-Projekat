import api from "../../shared/services/api/api";

// Get all recipes
export const getRecipes = async (page = 1, per_page = 10) => {
  const response = await api.get(
    `/api/v1/recipes?page=${page}&per_page=${per_page}`
  );
  console.log("API Response:"); // Debug log
  console.log("Fetched recipes:", response.data.data); // Debug log
  return response.data.data; // backend response format
};

// Get recipe by ID
export const getRecipeById = async (id) => {
  const response = await api.get(`/api/v1/recipes/${id}`);
  return response.data.data; // backend response format
};
