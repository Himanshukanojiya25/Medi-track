// src/services/api/http.client.ts
import axios from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 15000,
  withCredentials: true,
});
