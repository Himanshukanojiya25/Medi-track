/**
 * Checks whether a value is a valid phone number
 * - Supports international numbers
 * - E.164 inspired (but flexible)
 */
export function isPhone(value: unknown): boolean {
  if (typeof value !== "string") return false;

  const phone = value.trim();

  // + optional, country code non-zero, 7–15 digits
  const PHONE_REGEX = /^\+?[1-9]\d{6,14}$/;

  return PHONE_REGEX.test(phone);
}
