import { Types } from "mongoose";
import { AppointmentModel } from "../../models/appointment";
import { PrescriptionModel } from "../../models/prescription";
import { BillingModel } from "../../models/billing";
import { PatientModel } from "../../models/patient";
import { Role } from "../../constants/roles";

type ChatIntent =
  | "GREETING"
  | "FAQ"
  | "APPOINTMENT_QUERY"
  | "PRESCRIPTION_QUERY"
  | "BILLING_QUERY"
  | "PROFILE_QUERY"
  | "UNKNOWN";

interface ChatbotQueryParams {
  role: Role;
  intent: ChatIntent;
  userId: string;
  hospitalId?: string;
  payload?: unknown; // ✅ ADDED (future-proof)
}

export default class ChatbotService {
  static async handleQuery(params: ChatbotQueryParams) {
    const { role, intent, userId, hospitalId } = params;

    // -----------------------------
    // Basic validations
    // -----------------------------
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid User ID");
    }

    if (hospitalId && !Types.ObjectId.isValid(hospitalId)) {
      throw new Error("Invalid Hospital ID");
    }

    // -----------------------------
    // Intent handling
    // -----------------------------
    switch (intent) {
      case "GREETING":
        return {
          message: `Hello 👋 I am your MediTrack assistant for ${role.replace(
            "_",
            " "
          )}.`,
        };

      case "APPOINTMENT_QUERY":
        if (role === "DOCTOR") {
          return AppointmentModel.find({ doctorId: userId }).exec();
        }
        if (role === "PATIENT") {
          return AppointmentModel.find({ patientId: userId }).exec();
        }
        if (role === "HOSPITAL_ADMIN" && hospitalId) {
          return AppointmentModel.find({ hospitalId }).exec();
        }
        break;

      case "PRESCRIPTION_QUERY":
        if (role === "DOCTOR") {
          return PrescriptionModel.find({ doctorId: userId }).exec();
        }
        if (role === "PATIENT") {
          return PrescriptionModel.find({ patientId: userId }).exec();
        }
        if (role === "HOSPITAL_ADMIN" && hospitalId) {
          return PrescriptionModel.find({ hospitalId }).exec();
        }
        break;

      case "BILLING_QUERY":
        if (role === "PATIENT") {
          return BillingModel.find({ patientId: userId }).exec();
        }
        if (role === "HOSPITAL_ADMIN" && hospitalId) {
          return BillingModel.find({ hospitalId }).exec();
        }
        break;

      case "PROFILE_QUERY":
        if (role === "PATIENT") {
          return PatientModel.findById(userId).exec();
        }
        break;
    }

    throw new Error("Unauthorized access");
  }
}
