import api from "../../shared/services/api/api";

export const toggleFavourite = async (recipeId) => {
  const res = await api.post(`/api/v1/users/favourites/toggle/${recipeId}`);
  return res.data.data;
};

export const getMyFavourites = async () => {
  const res = await api.get("/api/v1/users/favourites/");
  return res.data.data;
};
