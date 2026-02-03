import {
  AISuggestion,
  SuggestionContext,
} from "../intelligence/suggestion.types";

/**
 * ============================
 * DOCTOR RULES
 * ============================
 */
export function doctorRules(
  context: SuggestionContext,
): AISuggestion[] | null {
  if (context.actorRole !== "doctor") return null;

  const load = context.doctorWorkload;
  if (!load) return null;

  const suggestions: AISuggestion[] = [];

  /**
   * Rule: Doctor overloaded today
   */
  if ((load.dailyAppointments ?? 0) >= 25) {
    suggestions.push({
      id: crypto.randomUUID(),
      code: "DOCTOR_HIGH_DAILY_LOAD",
      category: "workload",
      targetRole: "hospital_admin",
      priority: "high",
      title: "Doctor workload is high",
      message:
        "A doctor has a very high number of appointments today. Consider redistributing workload.",
      source: "rule_engine",
      createdAt: new Date(),
      metadata: {
        doctorId: context.actorId,
        dailyAppointments: load.dailyAppointments,
      },
    });
  }

  return suggestions.length ? suggestions : null;
}
