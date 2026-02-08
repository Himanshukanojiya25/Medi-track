import type { ID } from "../shared";

/**
 * Mapping between hospital and its admins
 */
export interface HospitalAdmin {
  readonly hospitalId: ID;
  readonly userId: ID;
  readonly assignedAt: string; // ISO 8601
}
