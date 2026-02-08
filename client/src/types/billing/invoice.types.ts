import type { ID, Timestamps } from "../shared";

/**
 * Invoice lifecycle status
 */
export enum InvoiceStatus {
  OPEN = "OPEN",
  PAID = "PAID",
  VOID = "VOID",
}

/**
 * Invoice entity (legal document)
 */
export interface Invoice extends Timestamps {
  readonly id: ID;

  readonly billId: ID;
  readonly invoiceNumber: string; // human-readable, unique

  readonly issuedAt: string; // ISO 8601
  readonly dueAt?: string;   // ISO 8601

  readonly status: InvoiceStatus;
}
