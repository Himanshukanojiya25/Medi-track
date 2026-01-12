// src/models/ai/ai-audit-log/ai-audit-log.model.ts

import { model, Model } from "mongoose";
import { AIAuditLogSchema } from "./ai-audit-log.schema";
import { AIAuditLogDocument } from "./ai-audit-log.types";

/**
 * =========================
 * MODEL INTERFACE
 * =========================
 * (Type only – for TypeScript)
 */
export interface AIAuditLogModelType
  extends Model<AIAuditLogDocument> {
  logEvent(
    payload: Partial<AIAuditLogDocument>
  ): Promise<AIAuditLogDocument>;
}

/**
 * =========================
 * STATIC METHODS
 * =========================
 */
AIAuditLogSchema.statics.logEvent =
  async function (
    payload: Partial<AIAuditLogDocument>
  ) {
    return this.create(payload);
  };

/**
 * =========================
 * MONGOOSE MODEL (VALUE)
 * =========================
 */
export const AIAuditLogModel = model<
  AIAuditLogDocument,
  AIAuditLogModelType
>(
  "AIAuditLog",
  AIAuditLogSchema
);
