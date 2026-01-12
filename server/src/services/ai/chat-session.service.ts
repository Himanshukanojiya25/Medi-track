// src/services/ai/chat-session.service.ts

import { Types } from "mongoose";
import { ChatSession } from "../../models/ai/chat-session";

/**
 * Session status (aligned with schema + future ready)
 */
export type ChatSessionStatus = "active" | "closed" | "expired";

export interface StartChatSessionInput {
  role: "patient" | "doctor" | "hospital-admin" | "super-admin" | "hospital";
  userId: string;          // incoming caller id (actor)
  hospitalId?: string;
}

export interface ChatSessionDTO {
  id: string;
  role: string;            // actorRole
  userId: string;          // actorId
  hospitalId?: string;
  status: ChatSessionStatus;
  createdAt: Date;
  updatedAt: Date;
  endedAt?: Date;
}

/**
 * ChatSessionService
 * ------------------------------------
 * STRICTLY schema-aligned implementation
 * (actor-based, audit-safe)
 */
export class ChatSessionService {
  /**
   * Start a new chat session
   */
  async startSession(
    input: StartChatSessionInput
  ): Promise<ChatSessionDTO> {
    this.validateStartInput(input);

    const actorObjectId = new Types.ObjectId(input.userId);

    const session = await ChatSession.create({
      // ---- ACTOR CONTEXT (SOURCE OF TRUTH) ----
      actorId: actorObjectId,
      actorRole: input.role,
      createdBy: actorObjectId,

      // ---- OPTIONAL CONTEXT ----
      hospitalId: input.hospitalId
        ? new Types.ObjectId(input.hospitalId)
        : undefined,

      // ---- SESSION STATE ----
      status: "active",
    });

    return this.toDTO(session as any);
  }

  /**
   * Fetch active session with ownership + hospital isolation
   */
  async getActiveSession(
    sessionId: string,
    userId: string,
    hospitalId?: string
  ): Promise<ChatSessionDTO> {
    if (!Types.ObjectId.isValid(sessionId)) {
      throw new Error("Invalid chat session id");
    }

    const session = await ChatSession.findById(sessionId);

    if (!session) {
      throw new Error("Chat session not found");
    }

    if (session.status !== "active") {
      throw new Error("Chat session is not active");
    }

    // ---- ACTOR OWNERSHIP CHECK ----
    if (session.actorId.toString() !== userId) {
      throw new Error("Unauthorized chat session access");
    }

    // ---- HOSPITAL ISOLATION ----
    if (
      hospitalId &&
      session.hospitalId &&
      session.hospitalId.toString() !== hospitalId
    ) {
      throw new Error("Hospital context mismatch");
    }

    return this.toDTO(session as any);
  }

  /**
   * Close an active session (idempotent)
   */
  async closeSession(
    sessionId: string,
    userId: string
  ): Promise<void> {
    if (!Types.ObjectId.isValid(sessionId)) {
      throw new Error("Invalid chat session id");
    }

    const session = await ChatSession.findById(sessionId);

    if (!session) {
      throw new Error("Chat session not found");
    }

    if (session.actorId.toString() !== userId) {
      throw new Error("Unauthorized chat session access");
    }

    if (session.status === "closed") {
      return;
    }

    session.status = "closed";
    session.endedAt = new Date();
    await session.save();
  }

  // ---------------- PRIVATE HELPERS ----------------

  private validateStartInput(
    input: StartChatSessionInput
  ): void {
    if (!input.role) {
      throw new Error("ChatSession: role is required");
    }

    if (!input.userId) {
      throw new Error("ChatSession: userId is required");
    }

    if (
      input.role !== "super-admin" &&
      input.role !== "hospital" &&
      !input.hospitalId
    ) {
      throw new Error(
        "ChatSession: hospitalId is required for this role"
      );
    }
  }

  /**
   * Convert DB document → API-safe DTO
   */
  private toDTO(session: any): ChatSessionDTO {
    return {
      id: session._id.toString(),

      // actor-based mapping (IMPORTANT)
      role: session.actorRole,
      userId: session.actorId.toString(),

      hospitalId: session.hospitalId
        ? session.hospitalId.toString()
        : undefined,

      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      endedAt: session.endedAt,
    };
  }
}
