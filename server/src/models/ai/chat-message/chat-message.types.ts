// src/models/ai/chat-message/chat-message.types.ts

import { Types } from "mongoose";

export type AIMessageRole =
  | "system"
  | "user"
  | "assistant";

export type AIMessageStatus =
  | "sent"
  | "failed"
  | "redacted";

export interface ChatMessageBase {
  hospitalId: Types.ObjectId;

  sessionId: Types.ObjectId;

  role: AIMessageRole;

  content: string;

  sequence: number;

  status: AIMessageStatus;

  metadata?: {
    model?: string;
    tokens?: number;
    latencyMs?: number;
    errorCode?: string;
  };

  createdBy: Types.ObjectId;
}

export interface ChatMessageDocument extends ChatMessageBase {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
