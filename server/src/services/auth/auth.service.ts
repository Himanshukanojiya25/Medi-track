import { LoginInput, LoginResponse } from "../../types/auth";
import { comparePassword } from "../../utils/auth/password.util";
import { signAccessToken, signRefreshToken } from "../../utils/auth/jwt.util";

// ===============================
// MODELS
// ===============================
import { SuperAdminModel } from "../../models/super-admin";
import { HospitalAdminModel } from "../../models/hospital-admin";
import { DoctorModel } from "../../models/doctor";
import { PatientModel } from "../../models/patient";

/**
 * ======================================================
 * CENTRAL LOGIN SERVICE
 * ------------------------------------------------------
 * Supports login for:
 * - SUPER_ADMIN
 * - HOSPITAL_ADMIN
 * - DOCTOR
 * - PATIENT
 *
 * Same email/password API for all roles
 * ======================================================
 */
export const loginService = async (
  input: LoginInput
): Promise<LoginResponse> => {
  const { email, password } = input;

  // --------------------------------------------------
  // COMMON VARIABLES
  // --------------------------------------------------
  let user: any = null;
  let role:
    | "SUPER_ADMIN"
    | "HOSPITAL_ADMIN"
    | "DOCTOR"
    | "PATIENT"
    | null = null;
  let passwordHash: string | null = null;
  let hospitalId: string | undefined;

  // ==================================================
  // 1️⃣ SUPER ADMIN LOGIN (HIGHEST PRIORITY)
  // ==================================================
  const superAdmin = await SuperAdminModel
    .findOne({ email })
    .select("+passwordHash");

  if (superAdmin) {
    user = superAdmin;
    role = "SUPER_ADMIN";
    passwordHash = superAdmin.passwordHash;
  }

  // ==================================================
  // 2️⃣ HOSPITAL ADMIN LOGIN
  // ==================================================
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

  // ==================================================
  // 3️⃣ DOCTOR LOGIN
  // ==================================================
  if (!user) {
    const doctor = await DoctorModel
      .findOne({ email })
      .select("+passwordHash");

    if (doctor) {
      user = doctor;
      role = "DOCTOR";
      passwordHash = doctor.passwordHash;
      hospitalId = doctor.hospitalId.toString();
    }
  }

  // ==================================================
  // 4️⃣ PATIENT LOGIN (LAST PRIORITY)
  // ==================================================
  if (!user) {
    const patient = await PatientModel
      .findOne({ email })
      .select("+password");

    if (patient) {
      user = patient;
      role = "PATIENT";
      passwordHash = patient.password;
      hospitalId = patient.hospitalId?.toString();
    }
  }

  // ==================================================
  // 5️⃣ USER NOT FOUND ANYWHERE
  // ==================================================
  if (!user || !passwordHash || !role) {
    throw new Error("Invalid email or password");
  }

  // ==================================================
  // 6️⃣ PASSWORD VERIFICATION
  // ==================================================
  const isValid = await comparePassword(password, passwordHash);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  // ==================================================
  // 7️⃣ JWT PAYLOAD
  // (This becomes req.user after auth middleware)
  // ==================================================
  const payload = {
    id: user._id.toString(),
    role,
    hospitalId,
  };

  // ==================================================
  // 8️⃣ TOKEN GENERATION
  // ==================================================
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // ==================================================
  // 9️⃣ FINAL RESPONSE
  // ==================================================
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
