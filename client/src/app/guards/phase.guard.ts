import { PHASES } from "../constants/phase.constants";

/**
 * Derived Phase type from PHASES constant
 */
export type Phase = (typeof PHASES)[keyof typeof PHASES];

/**
 * Phase Guard
 * -----------------------
 * Ensures feature/page is accessible only
 * after required phase is active.
 */
export function phaseGuard(
  currentPhase: Phase,
  requiredPhase: Phase
): boolean {
  return currentPhase >= requiredPhase;
}
