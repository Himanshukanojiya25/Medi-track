// src/services/api/http.client.ts
import axios, { AxiosError } from "axios";

// ── Instance ──────────────────────────────────────────────────────────────────

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 8000,          // 8s — fast failure so UI doesn't hang
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request interceptor — attach token ───────────────────────────────────────

httpClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor — normalise errors ───────────────────────────────────

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Network down / server not running
    if (!error.response) {
      const msg =
        error.code === "ECONNABORTED"
          ? "Request timed out. Please check your connection."
          : "Unable to reach the server. Please try again.";
      return Promise.reject(new Error(msg));
    }

    // Auth errors — redirect to login
    if (error.response.status === 401) {
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("access_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default httpClient;