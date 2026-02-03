import {
  AISuggestion,
  SuggestionContext,
  SuggestionRule,
} from "./suggestion.types";

/**
 * =====================================================
 * SUGGESTION ENGINE (CORE INTELLIGENCE)
 * =====================================================
 *
 * Responsibilities:
 * - Execute suggestion rules
 * - Ensure deterministic & safe output
 * - Never mutate input context
 * - Never throw (AI must be non-breaking)
 *
 * Design principles:
 * - Rules are pure functions
 * - Order matters
 * - Fail-safe by default
 */
export class SuggestionEngine {
  /**
   * Run suggestion engine
   */
  static run(
    context: SuggestionContext,
    rules: SuggestionRule[]
  ): AISuggestion[] {
    if (!context || !Array.isArray(rules) || rules.length === 0) {
      return [];
    }

    const suggestions: AISuggestion[] = [];

    for (const rule of rules) {
      try {
        /**
         * Rule execution
         * - Rule decides applicability
         * - Returns null if not applicable
         */
        const result = rule(Object.freeze({ ...context }));

        if (!result) continue;

        if (Array.isArray(result)) {
          suggestions.push(...result);
        } else {
          suggestions.push(result);
        }
      } catch {
        /**
         * HARD SAFETY GUARANTEE
         * ---------------------
         * - One bad rule must not break system
         */
        continue;
      }
    }

    return this.normalize(suggestions);
  }

  /**
   * Normalize suggestions
   * - Remove duplicates
   * - Stable deterministic output
   */
  private static normalize(
    suggestions: AISuggestion[]
  ): AISuggestion[] {
    const seen = new Set<string>();

    return suggestions.filter((s) => {
      /**
       * Dedup key
       * category + id is stable & semantic
       */
      const key = `${s.category}:${s.id}`;

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }
}
