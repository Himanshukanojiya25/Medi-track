import type { ID, ISODateString } from "../shared";

/**
 * Supported AI message roles
 */
export enum AIMessageRole {
  SYSTEM = "SYSTEM",
  USER = "USER",
  ASSISTANT = "ASSISTANT",
}

/**
 * Single message inside an AI conversation
 * Append-only by design
 */
export interface AIMessage {
  readonly id: ID;
  readonly chatId: ID;

  readonly role: AIMessageRole;
  readonly content: string;

  readonly createdAt: ISODateString;
}
