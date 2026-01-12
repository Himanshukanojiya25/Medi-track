// src/models/ai/ai-audit-log/ai-audit-log.types.ts

import { Types } from "mongoose";

export type AIAuditActorRole =
  | "super_admin"
  | "hospital_admin"
  | "doctor"
  | "patient"
  | "system";

export type AIAuditAction =
  | "SESSION_CREATED"
  | "SESSION_CLOSED"
  | "MESSAGE_CREATED"
  | "MESSAGE_REDACTED"
  | "PROMPT_ACTIVATED"
  | "PROMPT_ARCHIVED"
  | "AI_RESPONSE_GENERATED"
  | "AI_RESPONSE_FAILED";

export interface AIAuditLogBase {
  hospitalId: Types.ObjectId;

  actorId?: Types.ObjectId; // system events allowed
  actorRole: AIAuditActorRole;

  sessionId?: Types.ObjectId;
  messageId?: Types.ObjectId;
  promptVersionId?: Types.ObjectId;

  action: AIAuditAction;

  metadata?: Record<string, any>;

  ipAddress?: string;
  userAgent?: string;
}

export interface AIAuditLogDocument extends AIAuditLogBase {
  _id: Types.ObjectId;
  createdAt: Date;
}
