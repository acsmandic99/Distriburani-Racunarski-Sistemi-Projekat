import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? "https://backend-z574.onrender.com" 
    : "http://127.0.0.1:5000",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;