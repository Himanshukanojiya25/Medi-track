// src/constants/auth/auth.constants.ts

/**
 * AUTH & LOGIN RELATED CONSTANTS
 * No logic allowed in this file
 */

export const AUTH_CONSTANTS = {
  // Token names (for headers / cookies – future ready)
  ACCESS_TOKEN_NAME: "access_token",
  REFRESH_TOKEN_NAME: "refresh_token",

  // JWT expiry (logical defaults)
  ACCESS_TOKEN_EXPIRES_IN: "15m",
  REFRESH_TOKEN_EXPIRES_IN: "7d",

  // Auth strategies (future use)
  STRATEGY: {
    LOCAL: "local",
    JWT: "jwt",
  },
} as const;
