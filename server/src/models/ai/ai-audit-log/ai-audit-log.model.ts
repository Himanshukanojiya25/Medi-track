import { model, Model } from "mongoose";
import { AIAuditLogSchema } from "./ai-audit-log.schema";
import { AIAuditLogDocument } from "./ai-audit-log.types";

export interface AIAuditLogModelType
  extends Model<AIAuditLogDocument> {
  logEvent(
    payload: Partial<AIAuditLogDocument>
  ): Promise<AIAuditLogDocument>;
}

AIAuditLogSchema.statics.logEvent = async function (
  payload: Partial<AIAuditLogDocument>
) {
  return this.create(payload);
};

export const AIAuditLogModel = model<
  AIAuditLogDocument,
  AIAuditLogModelType
>("AIAuditLog", AIAuditLogSchema);
