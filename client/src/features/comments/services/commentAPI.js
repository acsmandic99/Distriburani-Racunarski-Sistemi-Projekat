import axios from "axios";

export const getCommentsForRecipe = async (recipeId, skip = 0, limit = 10) => {
  const res = await axios.get(`/comments/${recipeId}?skip=${skip}&limit=${limit}`);
  return res.data.data || [];
};

export const addComment = async (formData) => {
  const res = await axios.post("/comments/add-comment", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data;
};

export const deleteComment = async (commentId) => {
  const res = await axios.delete(`/comments/${commentId}`);
  return res.data;
};
