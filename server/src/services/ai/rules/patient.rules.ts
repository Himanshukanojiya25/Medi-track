import {
  AISuggestion,
  SuggestionContext,
} from "../intelligence/suggestion.types";

/**
 * ============================
 * PATIENT RULES
 * ============================
 */
export function patientRules(
  context: SuggestionContext,
): AISuggestion[] | null {
  if (context.actorRole !== "patient") return null;

  const history = context.patientHistory;
  if (!history) return null;

  const suggestions: AISuggestion[] = [];

  /**
   * Rule: Long time since last visit
   */
  if (history.lastVisitAt) {
    const days =
      (Date.now() - history.lastVisitAt.getTime()) /
      (1000 * 60 * 60 * 24);

    if (days > 90) {
      suggestions.push({
        id: crypto.randomUUID(),
        code: "PATIENT_LONG_NO_VISIT",
        category: "follow_up",
        targetRole: "patient",
        priority: "medium",
        title: "Time for a follow-up visit",
        message:
          "It’s been a while since your last visit. Consider booking a follow-up appointment.",
        source: "rule_engine",
        createdAt: new Date(),
      });
    }
  }

  return suggestions.length ? suggestions : null;
}
