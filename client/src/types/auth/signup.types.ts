import type { AuthSession } from "./auth.types";

/**
 * Signup API request payload
 * Role assignment backend decide karega
 */
export interface SignupRequest {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

/**
 * Signup API response
 */
export interface SignupResponse {
  readonly session: AuthSession;
}
