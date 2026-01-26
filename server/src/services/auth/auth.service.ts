import crypto from "crypto";
import bcrypt from "bcrypt";

import { LoginInput, LoginResponse } from "../../types/auth";
import {
  signAccessToken,
  signRefreshToken,
} from "../../utils/auth/jwt.util";

import { RefreshTokenModel } from "../../models/auth/refresh-token.model";

// ===============================
// MODELS
// ===============================
import { SuperAdminModel } from "../../models/super-admin";
import { HospitalAdminModel } from "../../models/hospital-admin";
import { DoctorModel } from "../../models/doctor";
import { PatientModel } from "../../models/patient";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const loginService = async (
  input: LoginInput
): Promise<LoginResponse> => {
  const { email, password } = input;

  let user: any = null;
  let role:
    | "SUPER_ADMIN"
    | "HOSPITAL_ADMIN"
    | "DOCTOR"
    | "PATIENT"
    | null = null;

  let passwordHash: string | null = null;
  let hospitalId: string | undefined;

  // ===============================
  // SUPER ADMIN
  // ===============================
  const superAdmin = await SuperAdminModel
    .findOne({ email })
    .select("+passwordHash");

  if (superAdmin) {
    user = superAdmin;
    role = "SUPER_ADMIN";
    passwordHash = superAdmin.passwordHash;
  }

  // ===============================
  // HOSPITAL ADMIN
  // ===============================
  if (!user) {
    const hospitalAdmin = await HospitalAdminModel
      .findOne({ email })
      .select("+passwordHash");

    if (hospitalAdmin) {
      user = hospitalAdmin;
      role = "HOSPITAL_ADMIN";
      passwordHash = hospitalAdmin.passwordHash;
      hospitalId = hospitalAdmin.hospitalId?.toString();
    }
  }

  // ===============================
  // DOCTOR
  // ===============================
  if (!user) {
    const doctor = await DoctorModel
      .findOne({ email })
      .select("+passwordHash");

    if (doctor) {
      user = doctor;
      role = "DOCTOR";
      passwordHash = doctor.passwordHash;
      hospitalId = doctor.hospitalId?.toString();
    }
  }

  // ===============================
  // PATIENT
  // ===============================
  if (!user) {
    const patient = await PatientModel
      .findOne({ email })
      .select("+passwordHash");

    if (patient) {
      user = patient;
      role = "PATIENT";
      passwordHash = patient.passwordHash;
      hospitalId = patient.hospitalId?.toString();
    }
  }

  // ===============================
  // VALIDATION
  // ===============================
  if (!user || !passwordHash || !role) {
    throw new Error("Invalid email or password");
  }

  /**
   * 🔥 FINAL FIX
   * Direct bcrypt.compare (no custom util)
   */
  const isValid = await bcrypt.compare(password, passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  // ===============================
  // TOKEN PAYLOAD
  // ===============================
  const payload = {
    id: user._id.toString(),
    role,
    hospitalId,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // ===============================
  // REFRESH TOKEN STORE
  // ===============================
  await RefreshTokenModel.create({
    userId: payload.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: payload.id,
      role,
      hospitalId,
    },
  };
};
