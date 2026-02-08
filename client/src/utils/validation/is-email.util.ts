/**
 * Checks whether a string is a valid email (practical RFC-safe)
 * - No false positives like "a@b"
 * - No over-complex regex (performance safe)
 */
export function isEmail(value: unknown): boolean {
  if (typeof value !== "string") return false;

  const email = value.trim();
  if (email.length < 5 || email.length > 254) return false;

  // Practical email regex (used in many production systems)
  const EMAIL_REGEX =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  return EMAIL_REGEX.test(email);
}
