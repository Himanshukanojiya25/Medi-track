/**
 * ============================================
 * AI ENHANCEMENT — CONSTANTS
 * ============================================
 * Phase: 3.3 (AI Enhancement Layer)
 */

/**
 * ------------------------------------------------
 * INTERNAL STATE (SINGLE SOURCE OF TRUTH)
 * ------------------------------------------------
 */
let _AI_ENHANCEMENT_ENABLED = true;

/**
 * ------------------------------------------------
 * TYPESCRIPT-VISIBLE EXPORT
 * ------------------------------------------------
 * Resolver imports this symbol directly
 */
export let AI_ENHANCEMENT_ENABLED = true;

/**
 * ------------------------------------------------
 * JEST-COMPATIBLE MODULE-LEVEL GETTER
 * ------------------------------------------------
 * Required for:
 * jest.spyOn(Constants, "AI_ENHANCEMENT_ENABLED", "get")
 */
Object.defineProperty(exports, "AI_ENHANCEMENT_ENABLED", {
  enumerable: true,
  configurable: true,
  get() {
    return _AI_ENHANCEMENT_ENABLED;
  },
  set(value: boolean) {
    _AI_ENHANCEMENT_ENABLED = value;
  },
});

/**
 * Default enhancement modes applied
 */
export const AI_ENHANCEMENT_DEFAULT_MODES = [
  "text_rewrite",
] as const;

/**
 * Hard safety limits
 */
export const AI_ENHANCEMENT_LIMITS = {
  MAX_MODES_PER_REQUEST: 3,
  MAX_INPUT_LENGTH: 2000,
  MAX_RESOLUTION_TIME_MS: 800,
};

/**
 * Cache configuration
 */
export const AI_ENHANCEMENT_CACHE = {
  ENABLED: true,
  TTL_SECONDS: 60 * 60,
};

/**
 * Supported languages
 */
export const AI_ENHANCEMENT_LANGUAGES = [
  "en",
  "hi",
  "en-IN",
] as const;

/**
 * Standardized error codes
 */
export const AI_ENHANCEMENT_ERRORS = {
  DISABLED: {
    code: "AI_ENHANCEMENT_DISABLED",
    message: "AI enhancement is currently disabled",
  },
  INVALID_INPUT: {
    code: "AI_ENHANCEMENT_INVALID_INPUT",
    message: "Invalid enhancement input",
  },
  TIMEOUT: {
    code: "AI_ENHANCEMENT_TIMEOUT",
    message: "AI enhancement timed out",
  },
  INTERNAL_ERROR: {
    code: "AI_ENHANCEMENT_INTERNAL_ERROR",
    message: "AI enhancement failed internally",
  },
} as const;
