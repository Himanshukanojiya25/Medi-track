/**
 * Formats amount into currency using Intl
 * - Deterministic (explicit locale + currency)
 * - Safe fallback on invalid input
 */
export function formatCurrency(
  amount: number,
  options?: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  if (!Number.isFinite(amount)) {
    throw new Error("Invalid amount passed to formatCurrency");
  }

  const {
    currency = "INR",
    locale = "en-IN",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options || {};

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}
