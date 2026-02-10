import api from "../../shared/services/api/api";

export const getCommentsForRecipe = async (recipeId, skip = 0, limit = 10) => {
  const res = await api.get(
    `/api/v1/comments/${recipeId}?skip=${skip}&limit=${limit}`,
  );
  return res.data.data || [];
};

export const addComment = async (formData) => {
  const res = await api.post("/api/v1/comments/add-comment", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
};

export const deleteComment = async (commentId, token) => {
  const res = await api.delete(`/api/v1/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
