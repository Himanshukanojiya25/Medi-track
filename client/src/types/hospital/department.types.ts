import type { ID, Timestamps } from "../shared";

/**
 * Hospital department (e.g. Cardiology)
 */
export interface Department extends Timestamps {
  readonly id: ID;
  readonly hospitalId: ID;

  readonly name: string;
  readonly description?: string;
  readonly isActive: boolean;
}
