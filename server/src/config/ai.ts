// src/config/ai.ts

import { ENV } from "./env";
import {
  AI_MODES,
  AIMode,
} from "../constants/ai/ai-mode.constants";

/**
 * Centralized AI Configuration (Enterprise Grade)
 * -----------------------------------------------
 * Principles:
 * - Env is used ONLY for secrets / credentials
 * - AI behaviour is system-controlled, not env-chaotic
 * - Mock-first, fail-safe defaults
 * - Zero runtime mutation
 */

const resolveAIMode = (): AIMode => {
  /**
   * If no API key → force MOCK
   * Safe for dev, test, prod
   */
  if (!ENV.OPENAI_API_KEY) {
    return AI_MODES.MOCK;
  }

  /**
   * If API key exists → REAL AI allowed
   */
  return AI_MODES.REAL;
};

const AI_MODE = resolveAIMode();

export const AI_CONFIG = Object.freeze({
  /**
   * Global AI mode
   * mock | real
   */
  MODE: AI_MODE,

  /**
   * Fast short-circuit flag
   */
  ENABLED: AI_MODE !== AI_MODES.MOCK,

  /**
   * Provider credentials only
   */
  PROVIDER: {
    API_KEY: ENV.OPENAI_API_KEY || "",
    MODEL: ENV.OPENAI_MODEL || "gpt-4o-mini",
    BASE_URL: ENV.OPENAI_API_BASE_URL || "",
  },

  /**
   * System-level safety limits
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
});
