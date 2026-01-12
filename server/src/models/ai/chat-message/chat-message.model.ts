// src/models/ai/chat-message/chat-message.model.ts

import { model, Model } from "mongoose";
import {
  ChatMessageDocument,
} from "./chat-message.types";
import { ChatMessageSchema } from "./chat-message.schema";

export interface ChatMessageModel
  extends Model<ChatMessageDocument> {
  redactMessage(
    messageId: string,
    updatedBy: string
  ): Promise<ChatMessageDocument | null>;
}

ChatMessageSchema.statics.redactMessage = async function (
  messageId: string,
  updatedBy: string
) {
  return this.findByIdAndUpdate(
    messageId,
    {
      status: "redacted",
      content: "[REDACTED]",
      metadata: {
        reason: "manual_redaction",
      },
      updatedBy,
    },
    { new: true }
  );
};

export const ChatMessage = model<
  ChatMessageDocument,
  ChatMessageModel
>("ChatMessage", ChatMessageSchema);
