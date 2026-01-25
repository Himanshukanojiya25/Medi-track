/**
 * AUTH ERROR MESSAGES
 * -------------------
 * ❌ No logic
 * ❌ No status codes
 * ✅ Only reusable error strings
 */

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password",
  UNAUTHORIZED: "Unauthorized access",
  TOKEN_EXPIRED: "Token has expired",
  TOKEN_INVALID: "Invalid token",
  TOKEN_MISSING: "Authentication token missing",
  FORBIDDEN: "You do not have permission to perform this action",
} as const;

export type AuthErrorMessage =
  typeof AUTH_ERROR_MESSAGES[keyof typeof AUTH_ERROR_MESSAGES];
