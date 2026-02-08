/**
 * Checks whether a value is empty
 * - null / undefined → empty
 * - string with only spaces → empty
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  return false;
}
