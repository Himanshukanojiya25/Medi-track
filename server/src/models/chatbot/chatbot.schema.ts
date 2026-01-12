import { Schema } from "mongoose";
import { IChatbotLog } from "./chatbot.types";
import { ChatbotStatus } from "../../constants/status";

export const ChatbotSchema = new Schema<IChatbotLog>(
  {
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      index: true,
    },

    userRole: {
      type: String,
      enum: ["super_admin", "hospital_admin", "doctor", "patient"],
      required: true,
      index: true,
    },

    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      index: true,
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      index: true,
    },

    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      index: true,
    },

    prompt: {
      type: String,
      required: true,
      trim: true,
    },

    response: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      index: true,
    },

    promptTokens: {
      type: Number,
      required: true,
      min: 0,
    },

    completionTokens: {
      type: Number,
      required: true,
      min: 0,
    },

    totalTokens: {
      type: Number,
      required: true,
      min: 0,
    },

    costUsd: {
      type: Number,
      required: true,
      min: 0,
    },

    latencyMs: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(ChatbotStatus),
      required: true,
      index: true,
    },

    errorMessage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

// 🔍 Useful analytics indexes
ChatbotSchema.index({ hospitalId: 1, createdAt: -1 });
ChatbotSchema.index({ userRole: 1, createdAt: -1 });
ChatbotSchema.index({ model: 1, createdAt: -1 });
