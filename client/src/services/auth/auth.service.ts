// src/services/auth/auth.service.ts

import { loginAPI } from "./auth.api";
import { LoginPayload, LoginResponse } from "./auth.types";

export const loginService = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await loginAPI(payload);

  const { accessToken } = response.data;

  /**
   * Token persistence
   */
  localStorage.setItem("access_token", accessToken);

  return response.data;
};
