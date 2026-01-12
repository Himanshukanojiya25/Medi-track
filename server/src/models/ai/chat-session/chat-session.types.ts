// src/models/ai/chat-session/chat-session.types.ts

import { Types } from "mongoose";

export type AISessionStatus =
  | "active"
  | "closed"
  | "expired";

export type AIRole =
  | "super_admin"
  | "hospital_admin"
  | "doctor"
  | "patient";

export interface ChatSessionBase {
  hospitalId: Types.ObjectId;
  actorId: Types.ObjectId;
  actorRole: AIRole;

  status: AISessionStatus;

  startedAt: Date;
  endedAt?: Date;

  context?: Record<string, any>;

  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

export interface ChatSessionDocument extends ChatSessionBase {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
