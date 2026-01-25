// client/src/api/client/apiClient.ts

import axios, { AxiosError, AxiosInstance } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * ⚠️ Hard guard – silent bugs avoid karne ke liye
 */
if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

/**
 * Axios instance
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 * Attach access token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Global error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    // Global auth failure
    if (status === 401) {
      localStorage.removeItem("access_token");

      /**
       * ⚠️ Yahan direct redirect nahi kar rahe
       * Routing layer decide karegi
       */
    }

    return Promise.reject(error);
  }
);
