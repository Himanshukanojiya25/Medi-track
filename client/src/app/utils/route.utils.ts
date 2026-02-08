import type { Role, AppPhase } from "../types";

/**
 * Route Utilities
 * ---------------
 * Used by routing + guards
 */

export interface RouteAccessRule {
  roles?: Role[];
  phases?: AppPhase[];
}

export function canAccessRoute(
  rule: RouteAccessRule,
  role: Role,
  phase: AppPhase
): boolean {
  if (rule.roles && !rule.roles.includes(role)) {
    return false;
  }

  if (rule.phases && !rule.phases.includes(phase)) {
    return false;
  }

  return true;
}
