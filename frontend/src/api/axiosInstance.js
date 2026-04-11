import axios from "axios";

// Ambil URL dari environment (misalnya 'http://localhost:5000' atau link Vercel)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Buat instance terpusat
const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
