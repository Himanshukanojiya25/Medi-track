/**
 * Capitalizes first character of a string
 */
export function capitalize(value: string): string {
  if (typeof value !== "string") {
    throw new Error("capitalize expects a string");
  }

  if (value.length === 0) return value;

  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Converts string to Title Case
 * - Splits on spaces
 * - Trims extra whitespace
 */
export function toTitleCase(value: string): string {
  if (typeof value !== "string") {
    throw new Error("toTitleCase expects a string");
  }

  return value
    .trim()
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
}

/**
 * Truncates string safely
 */
export function truncate(
  value: string,
  maxLength: number
): string {
  if (typeof value !== "string") {
    throw new Error("truncate expects a string");
  }

  if (!Number.isInteger(maxLength) || maxLength <= 0) {
    throw new Error("Invalid maxLength passed to truncate");
  }

  if (value.length <= maxLength) return value;

  return value.slice(0, maxLength - 1) + "…";
}
