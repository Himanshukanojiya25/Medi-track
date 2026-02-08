/**
 * Auth Guard
 * -----------------------
 * Single source of truth for authentication gating.
 * Stateless & side-effect free.
 */
export function authGuard(isAuthenticated: boolean): boolean {
  return isAuthenticated === true;
}
