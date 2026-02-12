import axios from "axios";
import api from "../../shared/services/api/api";

//const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = "https://tvoj-backend.onrender.com";
//const API_URL = `${BASE_URL}/api/v1/admin`;
const API_URL = "https://tvoj-backend.onrender.com/api/v1/admin";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getAuthorRequests = async () => {
  const response = await axios.get(
    `${API_URL}/author-requests`,
    getAuthHeaders(),
  );
  return response.data.data;
};

export const processAuthorRequest = async (requestId, action) => {
  const response = await axios.post(
    `${API_URL}/${action}-author/${requestId}`,
    {},
    getAuthHeaders(),
  );
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
  return response.data.data;
};

export const deleteUser = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/delete-user/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Greška pri brisanju");
  }

  return await response.json();
};

export const approveAuthorRequest = async (requestId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/approve-request/${requestId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Greška pri odobravanju");
  }
  return await response.json();
};

export const rejectAuthorRequest = async (requestId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/reject-request/${requestId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Greška pri odbijanju");
  }
  return await response.json();
};

export const downloadAdminReport = async () => {
  const response = await api.get("/api/v1/admin/report/pdf", {
    responseType: "blob",
  });

  return response.data;
};
