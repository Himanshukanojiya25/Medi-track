/**
 * Checks whether a permission exists in a permission list
 */
export function hasPermission(
  permissions: readonly string[],
  requiredPermission: string
): boolean {
  if (!Array.isArray(permissions)) {
    throw new Error("permissions must be an array");
  }

  if (typeof requiredPermission !== "string") {
    throw new Error("requiredPermission must be a string");
  }

  return permissions.includes(requiredPermission);
}
