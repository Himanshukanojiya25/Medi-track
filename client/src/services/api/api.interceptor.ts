// src/services/api/api.interceptor.ts
import { httpClient } from "./http.client";

export function setupApiInterceptors() {
  httpClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );
}
