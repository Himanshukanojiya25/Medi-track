/**
 * Content Security Policy (CSP)
 * Declarative and environment-agnostic
 *
 * NOTE:
 * - Start strict
 * - Relax per-need (analytics, payments, etc.)
 */
export const CONTENT_SECURITY_POLICY = {
  "default-src": ["'self'"],

  "script-src": [
    "'self'",
    "'unsafe-inline'", // remove when all inline scripts are eliminated
  ],

  "style-src": [
    "'self'",
    "'unsafe-inline'", // required for some CSS-in-JS
  ],

  "img-src": [
    "'self'",
    "data:",
    "blob:",
  ],

  "font-src": [
    "'self'",
    "data:",
  ],

  "connect-src": [
    "'self'",
  ],

  "frame-ancestors": ["'none'"],

  "base-uri": ["'self'"],
  "form-action": ["'self'"],
} as const;

/**
 * Helper to serialize CSP into header string
 * (used by server/CDN layer)
 */
export const CSP_HEADER_VALUE = Object.entries(CONTENT_SECURITY_POLICY)
  .map(([key, values]) => `${key} ${values.join(" ")}`)
  .join("; ");
