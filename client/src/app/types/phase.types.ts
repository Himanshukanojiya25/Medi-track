import { PHASES } from "../constants/phase.constants";

/**
 * Phase Types
 * -----------
 * Single source of truth: PHASES constant
 * Used for rollout, feature gating, experiments
 */

/**
 * AppPhase
 * --------
 * Derived from PHASES values
 * Auto-updates when new phase is added
 */
export type AppPhase = typeof PHASES[keyof typeof PHASES];

/**
 * PhaseContext
 * ------------
 * Runtime phase state container
 */
export interface PhaseContext {
  currentPhase: AppPhase;
  enabledPhases: readonly AppPhase[];
}
