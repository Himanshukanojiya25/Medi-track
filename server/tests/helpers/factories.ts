import { Types } from "mongoose";
import { HospitalModel } from "../../src/models/hospital";
import { HospitalAdminModel } from "../../src/models/hospital-admin";
import { DoctorModel } from "../../src/models/doctor";
import { PatientModel } from "../../src/models/patient";
import { AppointmentModel } from "../../src/models/appointment";

import {
  PatientStatus,
  DOCTOR_STATUS,
  AppointmentStatus,
} from "../../src/constants/status";

import { ROLES } from "../../src/constants/roles";

/* =========================
   COMMON UTILS
========================= */

export const objectId = () => new Types.ObjectId();

/* =========================
   HOSPITAL
========================= */

export async function createHospital(overrides: any = {}) {
  return HospitalModel.create({
    name: "Test Hospital",
    code: `HOSP-${Date.now()}-${Math.random()}`,
    email: `hospital-${Date.now()}@test.com`,
    phone: "9999999999",
    address: {
      line1: "Test Street",
      city: "Mumbai",
      state: "MH",
      country: "India",
      postalCode: "400001",
    },
    ...overrides,
  });
}

/* =========================
   HOSPITAL ADMIN
========================= */

export async function createHospitalAdmin(
  hospitalId: Types.ObjectId,
  overrides: any = {}
) {
  return HospitalAdminModel.create({
    hospitalId,
    name: "Test Admin",
    email: `admin-${Date.now()}@test.com`,
    passwordHash: "test-password-hash",
    role: ROLES.HOSPITAL_ADMIN,
    ...overrides,
  });
}

/* =========================
   DOCTOR
========================= */

export async function createDoctor(
  hospitalId: Types.ObjectId,
  hospitalAdminId: Types.ObjectId,
  overrides: any = {}
) {
  return DoctorModel.create({
    hospitalId,
    hospitalAdminId,
    name: "Dr Test",
    email: `doctor-${Date.now()}@test.com`,
    phone: "8888888888",
    specialization: "General",
    passwordHash: "test-password-hash",
    role: ROLES.DOCTOR,
    status: DOCTOR_STATUS.ACTIVE,
    ...overrides,
  });
}

/* =========================
   PATIENT
========================= */

export async function createPatient(
  hospitalId: Types.ObjectId,
  hospitalAdminId: Types.ObjectId,
  overrides: any = {}
) {
  return PatientModel.create({
    hospitalId,
    createdByHospitalAdminId: hospitalAdminId,
    firstName: "Test",
    lastName: "Patient",
    phone: "7777777777",
    passwordHash: "test-password-hash",
    status: PatientStatus.ACTIVE,
    ...overrides,
  });
}

/* =========================
   APPOINTMENT
========================= */

export async function createAppointment(
  hospitalId: Types.ObjectId,
  doctorId: Types.ObjectId,
  patientId: Types.ObjectId,
  overrides: any = {}
) {
  return AppointmentModel.create({
    hospitalId,
    doctorId,
    patientId,
    scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
    durationMinutes: 30,
    status: AppointmentStatus.SCHEDULED,
    ...overrides,
  });
}
