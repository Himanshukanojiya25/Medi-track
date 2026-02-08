/**
 * Standard security headers configuration
 * Framework-agnostic (Express / Nginx / Cloudflare)
 */
export const SECURITY_HEADERS = {
  /**
   * Prevent MIME sniffing
   */
  "X-Content-Type-Options": "nosniff",

  /**
   * Clickjacking protection
   */
  "X-Frame-Options": "DENY",

  /**
   * Basic XSS protection (legacy browsers)
   */
  "X-XSS-Protection": "1; mode=block",

  /**
   * Enforce HTTPS
   * max-age in seconds (1 year)
   */
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

  /**
   * Control referrer information
   */
  "Referrer-Policy": "strict-origin-when-cross-origin",

  /**
   * Disable powerful browser features by default
   */
  "Permissions-Policy": [
    "camera=()",
    "microphone=()",
    "geolocation=()",
    "payment=()",
  ].join(", "),
} as const;
