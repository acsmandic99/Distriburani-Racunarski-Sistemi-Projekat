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

export const requestAuthorRole = async () => {
  try {
    const response = await api.post(
      "/api/v1/author-managment/request-author-role/",
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Something went wrong");
    }
    throw error;
  }
};
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post("/api/v1/users/change-password/", {
    old_password: currentPassword,
    new_password: newPassword,
  });
  return response.data.data;
};

export const getAuthorProfile = async (authorId) => {
  try {
    const response = await api.get(`/api/v1/users/author-profile/${authorId}`);
    console.log("Author profile response:", response.data);
    return response.data.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Something went wrong");
    }
    throw error;
  }
};
