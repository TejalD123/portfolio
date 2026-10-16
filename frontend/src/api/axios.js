import axios from "axios";

// Base URL of your Express backend. Set VITE_API_URL in a .env file
// e.g. VITE_API_URL=http://localhost:5000
// Leave it empty (VITE_API_URL=) to use the Vite proxy (see vite.config.js), e.g. in Codespaces.
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Attach admin JWT token automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("td-admin-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to turn a relative uploads path from the backend into a full URL
export const fileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default api;