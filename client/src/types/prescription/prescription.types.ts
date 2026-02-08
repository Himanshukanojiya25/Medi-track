import type { ID, Timestamps } from "../shared";

/**
 * Medicine dosage unit
 * Keep explicit to avoid ambiguity
 */
export enum DosageUnit {
  MG = "MG",
  ML = "ML",
  TABLET = "TABLET",
  CAPSULE = "CAPSULE",
}

/**
 * Frequency of intake
 */
export enum IntakeFrequency {
  ONCE_DAILY = "ONCE_DAILY",
  TWICE_DAILY = "TWICE_DAILY",
  THRICE_DAILY = "THRICE_DAILY",
  AS_NEEDED = "AS_NEEDED",
}

/**
 * Prescribed medicine item
 */
export interface PrescribedMedicine {
  readonly name: string;
  readonly dosage: number;
  readonly unit: DosageUnit;
  readonly frequency: IntakeFrequency;
  readonly durationDays: number;
  readonly instructions?: string;
}

/**
 * Prescription record
 */
export interface Prescription extends Timestamps {
  readonly id: ID;

  readonly appointmentId: ID;
  readonly doctorId: ID;
  readonly patientId: ID;

  readonly medicines: readonly PrescribedMedicine[];

  readonly notes?: string;
}
