/**
 * Supported currencies
 * ISO 4217 currency codes
 */
export const SUPPORTED_CURRENCIES = [
  "INR",
  "USD",
] as const;

/**
 * Currency type
 */
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

/**
 * Default currency per locale
 */
export const DEFAULT_CURRENCY_BY_LOCALE: Record<string, SupportedCurrency> = {
  "en-IN": "INR",
  "en-US": "USD",
};

/**
 * Currency formatting defaults
 * (logic lives elsewhere, this is config only)
 */
export const CURRENCY_FORMAT_CONFIG = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const;
