import type { ID, Timestamps } from "../shared";

/**
 * Medical history record
 * Append-only friendly design
 */
export interface MedicalHistoryRecord extends Timestamps {
  readonly id: ID;
  readonly patientId: ID;

  readonly condition: string;
  readonly description?: string;

  readonly diagnosedAt?: string; // ISO 8601 date
  readonly isChronic: boolean;
}
