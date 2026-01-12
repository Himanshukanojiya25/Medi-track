import { model } from "mongoose";
import { ChatbotSchema } from "./chatbot.schema";
import { IChatbotLog } from "./chatbot.types";

export const ChatbotModel = model<IChatbotLog>(
  "ChatbotLog",
  ChatbotSchema
);
