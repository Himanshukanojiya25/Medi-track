/**
 * ============================================
 * AI ENHANCEMENT — TYPES
 * ============================================
 * Phase: 3.3 (AI Enhancement Layer)
 *
 * PURPOSE
 * -------
 * - Decorate existing AI suggestions
 * - Never influence suggestion generation
 * - Optional, fail-safe, read-only
 *
 * DESIGN GUARANTEES
 * -----------------
 * - No DB assumptions
 * - No provider assumptions
 * - Backward compatible
 */

/**
 * Supported enhancement capabilities
 */
export type AIEnhancementMode =
  | "text_rewrite"
  | "explanation"
  | "confidence_score"
  | "multilingual";

/**
 * Language support (future-safe)
 */
export type AIEnhancementLanguage =
  | "en"
  | "hi"
  | "en-IN";

/**
 * Enhancement request input
 * (built internally, never directly from client)
 */
export interface AIEnhancementInput {
  /**
   * Original suggestion id (runtime uuid)
   */
  suggestionId: string;

  /**
   * Stable business code
   * (used for caching & analytics)
   */
  suggestionCode: string;

  /**
   * Original suggestion message
   */
  originalMessage: string;

  /**
   * Target role viewing the suggestion
   */
  targetRole: string;

  /**
   * Requested enhancement modes
   */
  modes: AIEnhancementMode[];

  /**
   * Optional language preference
   */
  language?: AIEnhancementLanguage;

  /**
   * Optional metadata (read-only)
   */
  metadata?: Record<string, any>;
}

/**
 * Enhancement output
 * (partial — only what succeeded)
 */
export interface AIEnhancementResult {
  /**
   * Enhanced text (if generated)
   */
  enhancedMessage?: string;

  /**
   * Explanation of suggestion
   */
  explanation?: string;

  /**
   * Confidence score (0–1)
   */
  confidenceScore?: number;

  /**
   * Language of enhanced content
   */
  language?: AIEnhancementLanguage;
}

/**
 * Resolver response wrapper
 * (ensures fail-safe behavior)
 */
export interface AIEnhancementResponse {
  /**
   * Whether enhancement succeeded
   */
  success: boolean;

  /**
   * Partial enhancement data
   */
  data?: AIEnhancementResult;

  /**
   * Optional error (never thrown)
   */
  error?: {
    code: string;
    message: string;
  };
}
