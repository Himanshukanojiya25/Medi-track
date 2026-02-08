/**
 * Supported application locales
 * ISO 639-1 language codes
 */
export const SUPPORTED_LOCALES = [
  "en-IN", // English (India)
  "en-US", // English (US)
] as const;

/**
 * Locale type derived from supported list
 */
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

/**
 * Default locale for the application
 */
export const DEFAULT_LOCALE: SupportedLocale = "en-IN";

/**
 * Fallback locale if unsupported locale is detected
 */
export const FALLBACK_LOCALE: SupportedLocale = "en-US";
