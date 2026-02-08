import { PHASES } from "../constants/phase.constants";
import type { AppPhase } from "../types";

/**
 * Phase Utilities
 * ---------------
 * Object-safe phase checks
 */

const PHASE_VALUES = Object.values(PHASES) as AppPhase[];

export function isPhaseEnabled(phase: AppPhase): boolean {
  return PHASE_VALUES.includes(phase);
}

export function ensurePhaseAllowed(phase: AppPhase): void {
  if (!PHASE_VALUES.includes(phase)) {
    throw new Error(`Phase "${phase}" is not enabled`);
  }
}
 