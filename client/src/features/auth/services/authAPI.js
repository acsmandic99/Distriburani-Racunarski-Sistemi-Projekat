import api from "../../shared/services/api/api";

export const loginUser = async (email, password) => {
  const response = await api.post("api/v1/auth/login", { email, password });
  console.log("LOGIN RESPONSE:", response.data);
  return response.data;
};

export const registerUser = async (userData) => {
  // userData = { firstName, lastName, email, password, dob, gender, country, street, number }
  const response = await api.post("api/v1/users/register", userData);
  return response.data;
};
