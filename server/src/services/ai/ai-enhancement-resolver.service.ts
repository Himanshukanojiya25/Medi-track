import {
  AIEnhancementInput,
  AIEnhancementResponse,
  AIEnhancementResult,
} from "../../types/ai/ai-enhancement.types";
import {
  AI_ENHANCEMENT_ENABLED,
  AI_ENHANCEMENT_DEFAULT_MODES,
  AI_ENHANCEMENT_LIMITS,
  AI_ENHANCEMENT_ERRORS,
} from "../../constants/ai/ai-enhancement.constants";
import { AIEnhancementCacheService } from "./ai-enhancement-cache.service";

/**
 * =====================================================
 * AI ENHANCEMENT RESOLVER
 * =====================================================
 * Phase: 3.3 (AI Enhancement)
 *
 * RESPONSIBILITIES
 * ----------------
 * - Validate enhancement input (cheap)
 * - Enforce limits & timeouts
 * - Resolve enhancement (mock-first, provider-agnostic)
 * - Cache results
 * - NEVER throw (fail-safe)
 *
 * NON-GOALS
 * ---------
 * - No DB access
 * - No rule execution
 * - No governance / rate limiting
 */
export class AIEnhancementResolverService {
  /**
   * Resolve enhancement for a suggestion
   * Fail-safe by design
   */
  static async resolve(
    input: AIEnhancementInput
  ): Promise<AIEnhancementResponse> {
    try {
      // 1) Global kill-switch
      // IMPORTANT:
      // AI_ENHANCEMENT_ENABLED is a module-level getter,
      // but resolver must treat it like a boolean
      if (!AI_ENHANCEMENT_ENABLED) {
        return {
          success: false,
          error: AI_ENHANCEMENT_ERRORS.DISABLED,
        };
      }

      // 2) Defensive input validation (cheap)
      const validationError = this.validateInput(input);
      if (validationError) {
        return {
          success: false,
          error: validationError,
        };
      }

      // 3) Normalize modes
      const modes =
        input.modes && input.modes.length > 0
          ? input.modes
          : [...AI_ENHANCEMENT_DEFAULT_MODES];

      // 4) Cache key (stable & deterministic)
      const cacheKey = this.buildCacheKey(input, modes);

      // 5) Cache lookup
      const cached =
        await AIEnhancementCacheService.get(cacheKey);
      if (cached) {
        return {
          success: true,
          data: cached,
        };
      }

      // 6) Resolve with timeout protection
      const result = await this.withTimeout(
        () => this.resolveInternal(input, modes),
        AI_ENHANCEMENT_LIMITS.MAX_RESOLUTION_TIME_MS
      );

      // 7) Cache successful partial results
      if (result && Object.keys(result).length > 0) {
        await AIEnhancementCacheService.set(
          cacheKey,
          result
        );
      }

      return {
        success: true,
        data: result,
      };
    } catch (err: any) {
      /**
       * IMPORTANT:
       * - Timeout must surface as TIMEOUT
       * - Everything else = INTERNAL_ERROR
       */
      if (
        err?.code ===
        AI_ENHANCEMENT_ERRORS.TIMEOUT.code
      ) {
        return {
          success: false,
          error: AI_ENHANCEMENT_ERRORS.TIMEOUT,
        };
      }

      return {
        success: false,
        error: AI_ENHANCEMENT_ERRORS.INTERNAL_ERROR,
      };
    }
  }

  /**
   * ---------------------------------------------------
   * INTERNAL RESOLUTION (mock-first)
   * ---------------------------------------------------
   */
  private static async resolveInternal(
    input: AIEnhancementInput,
    modes: readonly string[]
  ): Promise<AIEnhancementResult> {
    const result: AIEnhancementResult = {};

    // TEXT REWRITE
    if (modes.includes("text_rewrite")) {
      result.enhancedMessage =
        input.originalMessage;
    }

    // EXPLANATION
    if (modes.includes("explanation")) {
      result.explanation =
        "This suggestion is based on observed system patterns and recent activity.";
    }

    // CONFIDENCE SCORE
    if (modes.includes("confidence_score")) {
      result.confidenceScore = 0.85;
    }

    // MULTILINGUAL
    if (modes.includes("multilingual")) {
      result.language = input.language || "en";
    }

    return result;
  }

  /**
   * ---------------------------------------------------
   * INPUT VALIDATION
   * ---------------------------------------------------
   */
  private static validateInput(
    input: AIEnhancementInput
  ): { code: string; message: string } | null {
    if (
      !input ||
      !input.suggestionId ||
      !input.suggestionCode ||
      !input.originalMessage
    ) {
      return AI_ENHANCEMENT_ERRORS.INVALID_INPUT;
    }

    if (
      input.originalMessage.length >
      AI_ENHANCEMENT_LIMITS.MAX_INPUT_LENGTH
    ) {
      return AI_ENHANCEMENT_ERRORS.INVALID_INPUT;
    }

    if (
      input.modes &&
      input.modes.length >
        AI_ENHANCEMENT_LIMITS.MAX_MODES_PER_REQUEST
    ) {
      return AI_ENHANCEMENT_ERRORS.INVALID_INPUT;
    }

    return null;
  }

  /**
   * ---------------------------------------------------
   * CACHE KEY
   * ---------------------------------------------------
   */
  private static buildCacheKey(
    input: AIEnhancementInput,
    modes: readonly string[]
  ): string {
    return [
      "ai-enhancement",
      input.suggestionCode,
      modes.join("|"),
      input.language || "default",
    ].join(":");
  }

  /**
   * ---------------------------------------------------
   * TIMEOUT GUARD
   * ---------------------------------------------------
   */
  private static async withTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    let timeoutHandle: NodeJS.Timeout;

    const timeoutPromise = new Promise<T>(
      (_, reject) => {
        timeoutHandle = setTimeout(() => {
          reject({
            code:
              AI_ENHANCEMENT_ERRORS.TIMEOUT.code,
          });
        }, timeoutMs);
      }
    );

    const result = await Promise.race([
      fn(),
      timeoutPromise,
    ]);

    clearTimeout(timeoutHandle!);
    return result;
  }
}
