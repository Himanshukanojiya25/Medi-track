/**
 * Checks whether a role can edit a resource
 * - Centralized edit policy
 * - Easy to extend later (ABAC / ownership)
 */
export function canEdit(role: string): boolean {
  if (typeof role !== "string") {
    throw new Error("role must be a string");
  }

  const normalizedRole = role.trim().toUpperCase();

  return (
    normalizedRole === "ADMIN" ||
    normalizedRole === "HOSPITAL_ADMIN" ||
    normalizedRole === "SUPER_ADMIN"
  );
}
