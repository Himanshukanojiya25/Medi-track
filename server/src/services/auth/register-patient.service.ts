import { hashPassword } from "../../utils/auth/password.util";
import { PatientModel } from "../../models/patient";
import { Types } from "mongoose";

/**
 * Input required for patient registration
 */
interface RegisterPatientInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

/**
 * DB view used internally (safe subset)
 */
interface PatientCreateDoc {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
}

/**
 * Safe response after registration
 */
interface RegisterPatientResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
}

/**
 * Register Patient Service
 */
export const registerPatientService = async (
  input: RegisterPatientInput
): Promise<RegisterPatientResponse> => {
  const { name, email, password, phone } = input;

  // 1️⃣ Check if email already exists
  const existingPatient = await PatientModel.findOne({ email }).lean();

  if (existingPatient) {
    throw new Error("Email already registered");
  }

  // 2️⃣ Hash password
  const hashedPassword = await hashPassword(password);

  // 3️⃣ Create patient & immediately convert to safe view
  const createdPatient = await PatientModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: "PATIENT",
    isActive: true,
  });

const patient = (createdPatient.toObject() as unknown) as PatientCreateDoc;

  // 4️⃣ Return safe response (NO mongoose document)
  return {
    id: patient._id.toString(),
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    role: patient.role,
    isActive: patient.isActive,
  };
};
