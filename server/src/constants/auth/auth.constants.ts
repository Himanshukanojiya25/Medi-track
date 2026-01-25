/**
 * AUTH & LOGIN RELATED CONSTANTS
 * ❌ No logic allowed
 */

export const AUTH_CONSTANTS = {
  /* ----------------------------
     TOKEN NAMES
  ----------------------------- */
  ACCESS_TOKEN_NAME: "access_token",
  REFRESH_TOKEN_NAME: "refresh_token",

  /* ----------------------------
     JWT EXPIRY
  ----------------------------- */
  ACCESS_TOKEN_EXPIRES_IN: "15m",
  REFRESH_TOKEN_EXPIRES_IN: "7d",

  /* ----------------------------
     AUTH STRATEGIES
  ----------------------------- */
  STRATEGY: {
    LOCAL: "local",
    JWT: "jwt",
  },
} as const;
