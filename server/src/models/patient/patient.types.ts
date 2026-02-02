import { Types } from "mongoose";
import { PatientStatus } from "../../constants/status";

export interface IPatient {
  _id: Types.ObjectId;

  hospitalId?: Types.ObjectId;
  createdByHospitalAdminId?: Types.ObjectId;

  firstName?: string;
  lastName?: string;

  email?: string;
  phone: string;

  /**
   * 🔐 AUTH
   */
  passwordHash: string;

  dateOfBirth?: Date;
  gender?: "male" | "female" | "other";
  bloodGroup?: string;

  emergencyContact?: {
    name: string;
    phone: string;
    relation?: string;
  };

  status: PatientStatus;

  /**
   * =========================
   * SOFT BLOCK (PHASE-2.5)
   * =========================
   */
  isBlocked: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
