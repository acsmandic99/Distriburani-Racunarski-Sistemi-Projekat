import api from "../../shared/services/api/api";

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export const loginUser = async (email, password) => {
  const response = await api.post("api/users/login", { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  // userData = { firstName, lastName, email, password, dob, gender, country, street, number }
  const response = await api.post("api/users/register", userData);
  return response.data;
};
