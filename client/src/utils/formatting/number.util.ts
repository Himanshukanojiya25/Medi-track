/**
 * Formats a number with grouping separators
 * - No rounding unless specified
 */
export function formatNumber(
  value: number,
  options?: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  if (!Number.isFinite(value)) {
    throw new Error("Invalid number passed to formatNumber");
  }

  const {
    locale = "en-IN",
    minimumFractionDigits,
    maximumFractionDigits,
  } = options || {};

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}
