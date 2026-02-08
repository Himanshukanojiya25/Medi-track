/**
 * Checks whether a JWT-like token expiry is passed
 * @param exp Unix timestamp (seconds)
 */
export function isTokenExpired(exp: number): boolean {
  if (!Number.isFinite(exp)) {
    throw new Error("Invalid token expiry value");
  }

  // JWT exp is in seconds
  return Date.now() >= exp * 1000;
}
