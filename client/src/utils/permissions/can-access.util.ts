/**
 * Checks whether a role is allowed to access a resource
 * - Pure role-based access check
 * - No side effects
 */
export function canAccess(
  role: string,
  allowedRoles: readonly string[]
): boolean {
  if (typeof role !== "string") {
    throw new Error("role must be a string");
  }

  if (!Array.isArray(allowedRoles)) {
    throw new Error("allowedRoles must be an array");
  }

  const normalizedRole = role.trim().toUpperCase();

  return allowedRoles.includes(normalizedRole);
}
