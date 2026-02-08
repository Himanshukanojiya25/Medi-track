import type { ID } from "../shared";
import type { UserRole } from "../role";
import type { AuthTokens } from "./token.types";

/**
 * Minimal authenticated user identity
 * (Profile data yahan nahi aata)
 */
export interface AuthUser {
  readonly id: ID;
  readonly email: string;
  readonly role: UserRole;
  readonly isActive: boolean;
}

/**
 * Authentication session
 */
export interface AuthSession {
  readonly user: AuthUser;
  readonly tokens: AuthTokens;
}
