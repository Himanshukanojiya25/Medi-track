import { connectDB, disconnectDB } from "../../../../src/config";

import { AppointmentModel } from "../../../../src/models/appointment";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { PatientModel } from "../../../../src/models/patient";
import { DoctorModel } from "../../../../src/models/doctor";

import { AppointmentStatus } from "../../../../src/constants/status";

describe("Appointment Schema Validation", () => {
  let hospitalId: any;
  let adminId: any;
  let patientId: any;
  let doctorId: any;

  beforeAll(async () => {
    await connectDB();

    // ✅ FULL VALID HOSPITAL (IMPORTANT)
    const hospital = await HospitalModel.create({
      name: "Appointment Schema Hospital",
      code: "APT-SCHEMA",
      email: "schema@hospital.com",
      phone: "9999999999",
      address: {
        line1: "Street",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });

    hospitalId = hospital._id;

    // ✅ ADMIN
    const admin = await HospitalAdminModel.create({
      name: "Schema Admin",
      hospitalId,
      email: "schema-admin@hospital.com",
      passwordHash: "hashed",
      createdBy: hospitalId,
    });

    adminId = admin._id;

    // ✅ PATIENT
    const patient = await PatientModel.create({
      hospitalId,
      createdByHospitalAdminId: adminId,
      firstName: "Schema",
      lastName: "Patient",
      phone: "9111111111",
    });

    patientId = patient._id;

    // ✅ DOCTOR
    const doctor = await DoctorModel.create({
      hospitalId,
      hospitalAdminId: adminId,
      name: "Dr Schema",
      email: "dr-schema@hospital.com",
      phone: "9222222222",
      specialization: "General",
    });

    doctorId = doctor._id;
  });

  afterAll(async () => {
    await AppointmentModel.deleteMany({});
    await PatientModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await HospitalAdminModel.deleteMany({});
    await HospitalModel.deleteMany({});
    await disconnectDB();
  });

  it("❌ should fail without required fields", async () => {
    await expect(AppointmentModel.create({})).rejects.toThrow();
  });

  it("❌ should fail without hospitalId", async () => {
    await expect(
      AppointmentModel.create({
        patientId,
        doctorId,
        scheduledAt: new Date(),
        durationMinutes: 30,
      })
    ).rejects.toThrow();
  });

  it("❌ should reject invalid status", async () => {
    await expect(
      AppointmentModel.create({
        hospitalId,
        patientId,
        doctorId,
        scheduledAt: new Date(),
        durationMinutes: 30,
        status: "INVALID_STATUS",
      })
    ).rejects.toThrow();
  });

  it("❌ should reject invalid duration", async () => {
    await expect(
      AppointmentModel.create({
        hospitalId,
        patientId,
        doctorId,
        scheduledAt: new Date(),
        durationMinutes: 1,
      })
    ).rejects.toThrow();
  });

  it("✅ should create appointment with valid data", async () => {
    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
      durationMinutes: 30,
      status: AppointmentStatus.SCHEDULED,
      createdByHospitalAdminId: adminId,
    });

    expect(appointment).toBeDefined();
    expect(appointment.durationMinutes).toBe(30);
  });
});
