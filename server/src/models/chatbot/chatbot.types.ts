import { Types } from "mongoose";
import { ChatbotStatus } from "../../constants/status";

export type ChatUserRole =
  | "super_admin"
  | "hospital_admin"
  | "doctor"
  | "patient";

export interface IChatbotLog {
  _id: Types.ObjectId;

  hospitalId?: Types.ObjectId;

  userId?: Types.ObjectId;
  userRole: ChatUserRole;

  patientId?: Types.ObjectId;
  doctorId?: Types.ObjectId;
  appointmentId?: Types.ObjectId;

  prompt: string;
  response: string;

  model: string;

  promptTokens: number;
  completionTokens: number;
  totalTokens: number;

  costUsd: number;

  latencyMs: number;

  status: ChatbotStatus;
  errorMessage?: string;

  createdAt: Date;
}
