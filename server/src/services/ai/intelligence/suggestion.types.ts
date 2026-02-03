/**
 * ============================
 * AI SUGGESTION — CORE TYPES
 * ============================
 * Phase: 3.2 (Intelligence Layer)
 *
 * SOURCE OF TRUTH
 * ----------------------------
 * - Hooks → build this context
 * - Rules → read this context
 * - Engine → orchestrates output
 *
 * NO runtime logic here.
 */

/**
 * =====================================================
 * TARGET ROLE
 * =====================================================
 */
export type SuggestionTargetRole =
  | "patient"
  | "doctor"
  | "hospital_admin"
  | "system";

/**
 * =====================================================
 * CATEGORY
 * =====================================================
 */
export type SuggestionCategory =
  | "follow_up"
  | "workload"
  | "alert"
  | "education"
  | "optimization";

/**
 * =====================================================
 * PRIORITY
 * =====================================================
 */
export type SuggestionPriority =
  | "low"
  | "medium"
  | "high";

/**
 * =====================================================
 * SOURCE
 * =====================================================
 */
export type SuggestionSource =
  | "rule_engine"
  | "ai_assist"
  | "system_default";

/**
 * =====================================================
 * SUGGESTION CONTEXT
 * =====================================================
 * Flat structure (intentional)
 * - Simple
 * - Readable
 * - Rule-friendly
 */
export interface SuggestionContext {
  /**
   * Hospital scope (mandatory)
   */
  hospitalId: string;

  /**
   * Actor invoking / viewing suggestions
   */
  actorRole: SuggestionTargetRole;
  actorId?: string;

  /**
   * ============================
   * SIGNALS FROM HOOKS (OPTIONAL)
   * ============================
   */

  /**
   * Appointment-related stats
   */
  appointmentStats?: {
    todayCount?: number;
    canceledCount?: number;
    completedCount?: number;
  };

  /**
   * Doctor workload signals
   */
  doctorWorkload?: {
    dailyAppointments?: number;
    weeklyAppointments?: number;
  };

  /**
   * Patient behavior history
   */
  patientHistory?: {
    lastVisitAt?: Date;
    missedAppointments?: number;
  };

  /**
   * Extensible metadata
   */
  metadata?: Record<string, any>;
}

/**
 * =====================================================
 * AI SUGGESTION PAYLOAD
 * =====================================================
 * FINAL output consumed by:
 * - Controllers
 * - UI
 * - (future) DB persistence
 */
export interface AISuggestion {
  /**
   * Runtime unique id (uuid)
   */
  id: string;

  /**
   * Stable business identifier
   * Used for:
   * - Deduplication
   * - Analytics
   * - Auditing
   *
   * Examples:
   * - DOCTOR_HIGH_DAILY_LOAD
   * - PATIENT_LONG_NO_VISIT
   */
  code: string;

  /**
   * Logical category
   */
  category: SuggestionCategory;

  /**
   * Who should see this suggestion
   */
  targetRole: SuggestionTargetRole;

  /**
   * Urgency
   */
  priority: SuggestionPriority;

  /**
   * UI-friendly title
   */
  title: string;

  /**
   * Main message
   */
  message: string;

  /**
   * Where it came from
   */
  source: SuggestionSource;

  /**
   * Optional contextual info
   */
  metadata?: Record<string, any>;

  /**
   * Creation timestamp
   */
  createdAt: Date;
}

/**
 * =====================================================
 * SUGGESTION RULE
 * =====================================================
 * Pure function:
 * - No side effects
 * - No mutation
 */
export type SuggestionRule =
  (context: Readonly<SuggestionContext>) =>
    | AISuggestion
    | AISuggestion[]
    | null;
