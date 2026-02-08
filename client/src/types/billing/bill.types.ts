import type { ID, Timestamps } from "../shared";

/**
 * Bill lifecycle status
 */
export enum BillStatus {
  DRAFT = "DRAFT",
  ISSUED = "ISSUED",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

/**
 * Core bill entity
 * Represents chargeable amount for an appointment/service
 */
export interface Bill extends Timestamps {
  readonly id: ID;

  readonly appointmentId: ID;
  readonly patientId: ID;
  readonly hospitalId: ID;

  readonly amountCents: number; // minor units (avoid floats)
  readonly currency: string;    // ISO 4217 (e.g. "INR")

  readonly status: BillStatus;
}
