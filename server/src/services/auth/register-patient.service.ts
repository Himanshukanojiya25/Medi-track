import { hashPassword } from "../../utils/auth/password.util";
import { PatientModel } from "../../models/patient";

/**
 * Input required for patient registration
 */
export interface RegisterPatientInput {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
}

/**
 * Safe response after registration
 */
export interface RegisterPatientResponse {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: "PATIENT";
  isActive: true;
}

export const registerPatientService = async (
  input: RegisterPatientInput
): Promise<RegisterPatientResponse> => {
  const { firstName, lastName, email, password, phone } = input;

  // 1️⃣ Duplicate check
  const exists = await PatientModel.findOne({ email }).lean();
  if (exists) {
    throw new Error("Email already registered");
  }

  // 2️⃣ Hash password
  const passwordHash = await hashPassword(password);

  // 3️⃣ Create patient (ONLY schema fields)
  const created = await PatientModel.create({
    firstName,
    lastName,
    email,
    passwordHash,
    phone,
  });

  // 4️⃣ Fetch lean object
  const patient = await PatientModel.findById(created._id)
    .select("firstName lastName email phone")
    .lean();

  if (!patient || !patient.email) {
    throw new Error("Patient creation failed");
  }

  // 5️⃣ Normalized response (NO schema assumptions)
  return {
    id: patient._id.toString(),
    fullName: `${patient.firstName ?? ""} ${patient.lastName ?? ""}`.trim(),
    email: patient.email,
    phone: patient.phone,
    role: "PATIENT",
    isActive: true,
  };
};
