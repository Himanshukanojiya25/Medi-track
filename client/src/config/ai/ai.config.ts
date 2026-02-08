import { AI_LIMITS } from "./ai-limits.config";
import { AI_MODES, AI_MODE_DEFAULTS } from "./ai-modes.config";

/**
 * High-level AI configuration
 * Used by services / guards / UI gating
 */
export const AI_CONFIG = {
  enabled: true,

  limits: AI_LIMITS,

  modes: AI_MODES,
  defaults: AI_MODE_DEFAULTS,

  /**
   * Conversation behavior
   */
  history: {
    includeSystemMessages: true,
    maxMessages: AI_LIMITS.maxConversationTurns,
  },
} as const;
