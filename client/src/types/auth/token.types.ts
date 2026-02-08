/**
 * Authentication tokens returned by backend
 * Treated as opaque strings on frontend
 */
export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

/**
 * Optional decoded token metadata
 * (Only if needed by app, not mandatory)
 */
export interface TokenMeta {
  readonly exp: number; // unix timestamp (seconds)
  readonly iat: number; // unix timestamp (seconds)
}
