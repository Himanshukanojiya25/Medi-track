/**
 * AI usage limits (provider-agnostic)
 * Units are explicit to avoid ambiguity
 */
export const AI_LIMITS = {
  /**
   * Requests
   */
  requestsPerMinute: 60,
  requestsPerDay: 1_000,

  /**
   * Tokens
   */
  maxInputTokens: 8_000,
  maxOutputTokens: 2_000,

  /**
   * Safety
   */
  maxConversationTurns: 50,
} as const;
