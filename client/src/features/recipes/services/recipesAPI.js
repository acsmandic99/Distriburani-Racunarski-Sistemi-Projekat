import api from "../../shared/services/api/api";

// Get all recipes
export const getRecipes = async (page = 1, per_page = 10) => {
  const response = await api.get(
    `/api/v1/recipes?page=${page}&per_page=${per_page}`
  );
  return response.data.data; // backend response format
};

// Get recipe by ID
export const getRecipeById = async (id) => {
  const response = await api.get(`/api/v1/recipes/${id}`);
  return response.data.data; // backend response format
};
