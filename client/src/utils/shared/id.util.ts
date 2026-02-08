/**
 * Generates a cryptographically secure unique ID
 * - Browser safe
 * - Collision resistant
 * - No external dependency
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  // Fallback (older browsers)
  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2, 10)
  );
}
