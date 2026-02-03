import { Types } from "mongoose";

export type AIAuditActorRole =
  | "super_admin"
  | "hospital_admin"
  | "doctor"
  | "patient"
  | "system";

/**
 * High-level audit category
 * (Phase-1 governance alignment)
 */
export type AIAuditActionType =
  | "CHAT"
  | "USAGE"
  | "LIMIT"
  | "SYSTEM";

/**
 * Fine-grained action
 */
export type AIAuditAction =
  | "SESSION_CREATED"
  | "SESSION_CLOSED"
  | "MESSAGE_CREATED"
  | "MESSAGE_REDACTED"
  | "PROMPT_ACTIVATED"
  | "PROMPT_ARCHIVED"
  | "AI_RESPONSE_GENERATED"
  | "AI_RESPONSE_FAILED"
  | "RATE_LIMIT_BLOCKED"
  | "USAGE_RECORDED";

export interface AIAuditLogBase {
  hospitalId: Types.ObjectId;

  actorId?: Types.ObjectId;
  actorRole: AIAuditActorRole;

  /**
   * Governance metadata
   */
  aiMode: "mock" | "real";
  actionType: AIAuditActionType;

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
