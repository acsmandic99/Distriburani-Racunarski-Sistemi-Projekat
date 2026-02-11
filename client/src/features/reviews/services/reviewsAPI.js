import api from "../../shared/services/api/api";

export const addReview = async (recipeId, formData) => {
  const response = await api.post(
    `/api/v1/recipes/reviews/recipe/${recipeId}/review`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
};
