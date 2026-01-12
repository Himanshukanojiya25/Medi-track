import { AIAuditLogModel } from "../../models/ai/ai-audit-log";

interface AuditLogPayload {
  hospitalId: string;
  actorId?: string;
  actorRole: "super_admin" | "hospital_admin" | "doctor" | "patient" | "system";
  action: string;
  metadata?: Record<string, unknown>;
  sessionId?: string;
  messageId?: string;
  promptVersionId?: string;
}

export default class AuditService {
  static async log(payload: AuditLogPayload) {
    await AIAuditLogModel.create({
      hospitalId: payload.hospitalId,
      actorId: payload.actorId,
      actorRole: payload.actorRole,
      action: payload.action,
      metadata: payload.metadata ?? {},
      sessionId: payload.sessionId,
      messageId: payload.messageId,
      promptVersionId: payload.promptVersionId,
    });
  }
}
