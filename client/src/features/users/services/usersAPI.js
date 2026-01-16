import api from "../../shared/services/api/api";
export const updateProfile = async (data, avatar) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  if (avatar) {
    formData.append("avatar", avatar);
  }
  const response = await api.patch("/api/v1/users/update/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};
