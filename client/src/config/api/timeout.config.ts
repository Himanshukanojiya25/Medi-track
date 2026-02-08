/**
 * API timeout values (milliseconds)
 * Centralized to avoid magic numbers
 */
export const API_TIMEOUT = {
  DEFAULT: 10_000,   // 10s
  UPLOAD: 60_000,    // large file uploads
  AI: 30_000,        // AI responses
} as const;
