/**
 * Formats a Date into ISO string safely
 * - Always returns ISO 8601
 * - Returns null for invalid dates
 * - No locale / timezone ambiguity
 */
export function formatDateISO(
  value: Date | string | number
): string | null {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}
