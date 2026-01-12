// src/models/ai/chat-session/chat-session.model.ts

import { model, Model } from "mongoose";
import {
  ChatSessionDocument,
} from "./chat-session.types";
import { ChatSessionSchema } from "./chat-session.schema";

export interface ChatSessionModel
  extends Model<ChatSessionDocument> {
  closeSession(
    sessionId: string,
    updatedBy: string
  ): Promise<ChatSessionDocument | null>;
}

ChatSessionSchema.statics.closeSession = async function (
  sessionId: string,
  updatedBy: string
) {
  return this.findByIdAndUpdate(
    sessionId,
    {
      status: "closed",
      endedAt: new Date(),
      updatedBy,
    },
    { new: true }
  );
};

export const ChatSession = model<
  ChatSessionDocument,
  ChatSessionModel
>("ChatSession", ChatSessionSchema);
