/**
 * Returns absolute difference between two dates in milliseconds
 * - Accepts Date | string | number
 * - Always non-negative
 */
export function diffTimeMs(
  a: Date | string | number,
  b: Date | string | number
): number {
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();

  if (Number.isNaN(d1) || Number.isNaN(d2)) {
    throw new Error("Invalid date provided to diffTimeMs");
  }

  return Math.abs(d1 - d2);
}
