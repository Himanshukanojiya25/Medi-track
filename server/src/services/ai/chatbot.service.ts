import { Types } from "mongoose";

import { AppointmentModel } from "../../models/appointment";
import { PrescriptionModel } from "../../models/prescription";
import { BillingModel } from "../../models/billing";
import { PatientModel } from "../../models/patient";

/**
 * Chatbot Service
 * ----------------
 * Role-aware, read-only conversational logic.
 * NO LLM calls here.
 * NO Express.
 * NO writes.
 */
export default class ChatbotService {
  /**
   * Handle chatbot query based on role & intent
   */
  static async handleQuery(params: {
    role: "SUPER_ADMIN" | "HOSPITAL_ADMIN" | "DOCTOR" | "PATIENT";
    intent:
      | "GREETING"
      | "FAQ"
      | "APPOINTMENT_QUERY"
      | "PRESCRIPTION_QUERY"
      | "BILLING_QUERY"
      | "PROFILE_QUERY"
      | "UNKNOWN";
    userId: string;
    hospitalId?: string;
    payload?: Record<string, unknown>;
  }) {
    const { role, intent, userId, hospitalId } = params;

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid User ID");
    }

    if (hospitalId && !Types.ObjectId.isValid(hospitalId)) {
      throw new Error("Invalid Hospital ID");
    }

    switch (intent) {
      case "GREETING":
        return this.handleGreeting(role);

      case "APPOINTMENT_QUERY":
        return this.handleAppointmentQuery(role, userId, hospitalId);

      case "PRESCRIPTION_QUERY":
        return this.handlePrescriptionQuery(role, userId, hospitalId);

      case "BILLING_QUERY":
        return this.handleBillingQuery(role, userId, hospitalId);

      case "PROFILE_QUERY":
        return this.handleProfileQuery(role, userId);

      case "FAQ":
        return {
          message: "Please ask a specific question related to your data.",
        };

      default:
        return {
          message: "Sorry, I did not understand your request.",
        };
    }
  }

  /**
   * Greeting
   */
  private static handleGreeting(role: string) {
    return {
      message: `Hello 👋 I am your MediTrack assistant for ${role.replace(
        "_",
        " "
      )}. How can I help you today?`,
    };
  }

  /**
   * Appointment Queries
   */
  private static async handleAppointmentQuery(
    role: string,
    userId: string,
    hospitalId?: string
  ) {
    if (role === "DOCTOR") {
      return AppointmentModel.find({ doctorId: userId }).exec();
    }

    if (role === "PATIENT") {
      return AppointmentModel.find({ patientId: userId }).exec();
    }

    if (role === "HOSPITAL_ADMIN" && hospitalId) {
      return AppointmentModel.find({ hospitalId }).exec();
    }

    throw new Error("Unauthorized appointment access");
  }

  /**
   * Prescription Queries
   */
  private static async handlePrescriptionQuery(
    role: string,
    userId: string,
    hospitalId?: string
  ) {
    if (role === "DOCTOR") {
      return PrescriptionModel.find({ doctorId: userId }).exec();
    }

    if (role === "PATIENT") {
      return PrescriptionModel.find({ patientId: userId }).exec();
    }

    if (role === "HOSPITAL_ADMIN" && hospitalId) {
      return PrescriptionModel.find({ hospitalId }).exec();
    }

    throw new Error("Unauthorized prescription access");
  }

  /**
   * Billing Queries (READ-ONLY)
   */
  private static async handleBillingQuery(
    role: string,
    userId: string,
    hospitalId?: string
  ) {
    if (role === "PATIENT") {
      return BillingModel.find({ patientId: userId }).exec();
    }

    if (role === "HOSPITAL_ADMIN" && hospitalId) {
      return BillingModel.find({ hospitalId }).exec();
    }

    throw new Error("Unauthorized billing access");
  }

  /**
   * Profile Queries
   */
  private static async handleProfileQuery(
    role: string,
    userId: string
  ) {
    if (role === "PATIENT") {
      return PatientModel.findById(userId).exec();
    }

    throw new Error("Profile access not allowed for this role");
  }
}
