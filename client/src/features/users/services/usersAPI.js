import api from "../../shared/services/api/api";

export const updateProfile = async (data, avatar) => {
  /*
  // Zakomentarisana logika, slobodno promeniti ako treba da fituje backendu

  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  if (avatar) {
    formData.append("avatar", avatar);
  }

  const response = await api.put("/api/v1/users/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
  */

  // Placeholder za sada
  console.log("[usersAPI] updateProfile called with:", data, avatar);
  return Promise.resolve({ success: true });
};
