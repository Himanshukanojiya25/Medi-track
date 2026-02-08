/**
 * Checks whether a date/time is expired (past)
 * - Accepts Date | string | number
 * - Uses current system time
 */
export function isExpired(
  value: Date | string | number
): boolean {
  const time = new Date(value).getTime();

  if (Number.isNaN(time)) {
    throw new Error("Invalid date provided to isExpired");
  }

  return time < Date.now();
}
