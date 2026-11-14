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

// Cloudinary images: ask for the smallest good format (WebP/AVIF) and automatic quality.
// Only touches versioned image URLs that have no transformation yet. Resume PDFs ("/raw/upload/") are left alone.
const optimizeCloudinary = (url) =>
  url.includes("res.cloudinary.com") && /\/image\/upload\/v\d+\//.test(url)
    ? url.replace("/image/upload/", "/image/upload/f_auto,q_auto/")
    : url;

// Helper to turn a relative uploads path from the backend into a full URL
export const fileUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return optimizeCloudinary(path);
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default api;
