/**
 * Normalizes role value into a predictable format
 * - Uppercases
 * - Trims whitespace
 */
export function normalizeRole(role: unknown): string {
  if (typeof role !== "string") {
    throw new Error("Role must be a string");
  }

  return role.trim().toUpperCase();
}
