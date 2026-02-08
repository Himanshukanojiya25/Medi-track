import type { ID, Timestamps } from "../shared";

/**
 * Supported payment methods
 * Gateway-agnostic
 */
export enum PaymentMethod {
  CARD = "CARD",
  UPI = "UPI",
  NET_BANKING = "NET_BANKING",
  CASH = "CASH",
}

/**
 * Payment processing status
 */
export enum PaymentStatus {
  INITIATED = "INITIATED",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

/**
 * Payment transaction record
 */
export interface Payment extends Timestamps {
  readonly id: ID;

  readonly billId: ID;
  readonly amountCents: number;
  readonly currency: string;

  readonly method: PaymentMethod;
  readonly status: PaymentStatus;

  readonly providerRef?: string; // gateway reference (opaque)
}
