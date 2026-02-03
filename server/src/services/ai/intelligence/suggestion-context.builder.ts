/**
 * =====================================
 * SUGGESTION CONTEXT BUILDER
 * =====================================
 * Phase: 3.2 (Intelligence Layer)
 *
 * Responsibility:
 * - Normalize raw domain data
 * - Provide clean, predictable context to rules
 *
 * Rules MUST NOT:
 * - Touch DB
 * - Guess missing fields
 * - Depend on request objects
 */

/**
 * Context related to an appointment
 * (minimum intelligence surface)
 */
export interface AppointmentSuggestionContext {
  appointmentId: string;

  hospitalId: string;

  patientId: string;
  doctorId: string;

  /**
   * Appointment lifecycle
   */
  status: "completed" | "cancelled" | "no_show";

  /**
   * When appointment happened
   */
  appointmentDate: Date;

  /**
   * Whether a follow-up already exists
   */
  hasFollowUp: boolean;

  /**
   * Whether prescription was generated
   */
  prescriptionCreated: boolean;

  /**
   * Optional domain hints
   */
  department?: string;
  specialization?: string;

  /**
   * Historical signals (optional)
   */
  previousAppointmentCount?: number;
}

/**
 * =====================================
 * BUILDER
 * =====================================
 */
export class SuggestionContextBuilder {
  /**
   * Build context for appointment-based suggestions
   *
   * IMPORTANT:
   * - Caller must pass all required fields
   * - No DB calls allowed here
   */
  static buildFromAppointment(
    input: AppointmentSuggestionContext,
  ): AppointmentSuggestionContext {
    /**
     * Defensive validation
     * (fail fast instead of silent intelligence bugs)
     */
    if (!input.appointmentId) {
      throw new Error("appointmentId is required");
    }

    if (!input.patientId || !input.doctorId) {
      throw new Error("patientId and doctorId are required");
    }

    if (!input.hospitalId) {
      throw new Error("hospitalId is required");
    }

    if (!input.appointmentDate) {
      throw new Error("appointmentDate is required");
    }

    /**
     * Normalize optional booleans
     */
    return {
      ...input,
      hasFollowUp: Boolean(input.hasFollowUp),
      prescriptionCreated: Boolean(input.prescriptionCreated),
      previousAppointmentCount:
        typeof input.previousAppointmentCount === "number"
          ? input.previousAppointmentCount
          : undefined,
    };
  }
}
