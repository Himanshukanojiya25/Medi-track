import type { ID, ISODateString } from "../shared";

/**
 * AI chat session metadata
 */
export interface AIChat {
  readonly id: ID;

  readonly ownerId: ID;        // userId / patientId / doctorId
  readonly ownerRole: string;  // kept string to avoid tight coupling

  readonly title?: string;
  readonly createdAt: ISODateString;
  readonly lastMessageAt?: ISODateString;
}
