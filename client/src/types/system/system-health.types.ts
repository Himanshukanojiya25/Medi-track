/**
 * System operational status
 */
export enum SystemStatus {
  OK = "OK",
  DEGRADED = "DEGRADED",
  DOWN = "DOWN",
}

/**
 * Individual service health
 */
export interface ServiceHealth {
  readonly name: string;
  readonly status: SystemStatus;
  readonly message?: string;
}

/**
 * Overall system health snapshot
 */
export interface SystemHealth {
  readonly status: SystemStatus;
  readonly services: readonly ServiceHealth[];
  readonly checkedAt: string; // ISO 8601
}
