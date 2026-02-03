import {
  AISuggestion,
  SuggestionContext,
} from "../intelligence/suggestion.types";

/**
 * ============================
 * ADMIN RULES
 * ============================
 */
export function adminRules(
  context: SuggestionContext,
): AISuggestion[] | null {
  if (context.actorRole !== "hospital_admin") return null;

  const suggestions: AISuggestion[] = [];

  /**
   * Rule: System-generated optimization hint
   */
  suggestions.push({
    id: crypto.randomUUID(),
    code: "ADMIN_REVIEW_DAILY_STATS",
    category: "optimization",
    targetRole: "hospital_admin",
    priority: "low",
    title: "Review daily hospital performance",
    message:
      "Daily operational stats are available. Reviewing them can help optimize hospital workflows.",
    source: "system_default",
    createdAt: new Date(),
  });

  return suggestions;
}
