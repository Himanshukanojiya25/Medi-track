import {
  AISuggestion,
  SuggestionContext,
} from "../intelligence/suggestion.types";

/**
 * ============================
 * APPOINTMENT RULES
 * ============================
 */
export function appointmentRules(
  context: SuggestionContext,
): AISuggestion[] | null {
  const suggestions: AISuggestion[] = [];

  const stats = context.appointmentStats;
  if (!stats) return null;

  /**
   * Rule 1: Too many cancellations
   */
  if (
    context.actorRole === "patient" &&
    (stats.canceledCount ?? 0) >= 3
  ) {
    suggestions.push({
      id: crypto.randomUUID(),
      code: "PATIENT_HIGH_CANCELLATION",
      category: "alert",
      targetRole: "hospital_admin",
      priority: "high",
      title: "Patient frequently cancels appointments",
      message:
        "This patient has canceled multiple appointments recently. Consider follow-up or policy review.",
      source: "rule_engine",
      createdAt: new Date(),
      metadata: {
        patientId: context.actorId,
        canceledCount: stats.canceledCount,
      },
    });
  }

  /**
   * Rule 2: No completed appointments today
   */
  if (
    context.actorRole === "doctor" &&
    (stats.completedCount ?? 0) === 0 &&
    (stats.todayCount ?? 0) > 0
  ) {
    suggestions.push({
      id: crypto.randomUUID(),
      code: "DOCTOR_NO_COMPLETIONS_TODAY",
      category: "optimization",
      targetRole: "doctor",
      priority: "medium",
      title: "No appointments completed today",
      message:
        "You have appointments scheduled today but none marked as completed yet.",
      source: "rule_engine",
      createdAt: new Date(),
    });
  }

  return suggestions.length ? suggestions : null;
}
