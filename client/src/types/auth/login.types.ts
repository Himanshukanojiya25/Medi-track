import type { AuthSession } from "./auth.types";

/**
 * Login API request payload
 */
export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

/**
 * Login API response
 */
export interface LoginResponse {
  readonly session: AuthSession;
}
