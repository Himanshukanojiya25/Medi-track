// src/services/auth/auth.apis.ts

import { apiClient } from "../../api/client";
import { LoginPayload, LoginResponse } from "./auth.types";

export const loginAPI = (payload: LoginPayload) => {
  return apiClient.post<LoginResponse>("/auth/login", payload);
};
