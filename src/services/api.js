import axios from "axios";

// The base URL for your local backend API
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // If you plan to add authentication later
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
