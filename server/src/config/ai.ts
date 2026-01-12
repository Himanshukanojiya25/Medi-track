// src/config/ai.ts

import { ENV } from "./env";

/**
 * Centralized AI configuration
 * --------------------------------
 * - No direct process.env usage
 * - Safe when AI key is missing
 * - Ready for OpenAI / Azure / others
 */
export const AI_CONFIG = {
  /**
   * Whether real AI is enabled
   * (false = mock provider will be used)
   */
  ENABLED: Boolean(ENV.OPENAI_API_KEY),

  /**
   * OpenAI / LLM provider key
   * Empty string allowed in dev/test
   */
  API_KEY: ENV.OPENAI_API_KEY,

  /**
   * Default model to use
   */
  MODEL: ENV.OPENAI_MODEL,

  /**
   * Safety & limits (future ready)
   */
  LIMITS: {
    MAX_TOKENS_PER_REQUEST: 1000,
    MAX_REQUESTS_PER_MINUTE: 60,
  },

  /**
   * Behaviour flags
   */
  FLAGS: {
    ENABLE_STREAMING: false,
    ENABLE_ACTION_ENGINE: false,
    ENABLE_MULTILINGUAL: true,
  },
} as const;

/**
 * Freeze config to prevent runtime mutation
 */
Object.freeze(AI_CONFIG);
