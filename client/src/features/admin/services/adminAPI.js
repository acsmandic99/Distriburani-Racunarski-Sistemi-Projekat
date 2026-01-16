import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/admin"; // Prilagodi svom URL-u

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getAuthorRequests = async () => {
  const response = await axios.get(`${API_URL}/author-requests`, getAuthHeaders());
  return response.data.data;
};

export const processAuthorRequest = async (requestId, action) => {
  // action je 'approve' ili 'reject'
  const response = await axios.post(`${API_URL}/${action}-author/${requestId}`, {}, getAuthHeaders());
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
  return response.data.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/users/${userId}`, getAuthHeaders());
  return response.data;
};