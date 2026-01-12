import { connectDB, disconnectDB } from "../../../../src/config";

import { PrescriptionModel } from "../../../../src/models/prescription";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { PatientModel } from "../../../../src/models/patient";
import { DoctorModel } from "../../../../src/models/doctor";

import { PrescriptionStatus } from "../../../../src/constants/status";

describe("Prescription Schema Validation", () => {
  let hospitalId: any;
  let adminId: any;
  let patientId: any;
  let doctorId: any;

  beforeAll(async () => {
    await connectDB();

    // ✅ FULL VALID HOSPITAL (MOST IMPORTANT)
    const hospital = await HospitalModel.create({
      name: "Prescription Schema Hospital",
      code: "RX-SCHEMA",
      email: "rx-schema@hospital.com",
      phone: "9999998888",
      address: {
        line1: "Street",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });

    hospitalId = hospital._id;

    const admin = await HospitalAdminModel.create({
      name: "Rx Admin",
      hospitalId,
      email: "rx-admin@hospital.com",
      passwordHash: "hashed",
      createdBy: hospitalId,
    });

    adminId = admin._id;

    const patient = await PatientModel.create({
      hospitalId,
      createdByHospitalAdminId: adminId,
      firstName: "Rx",
      lastName: "Patient",
      phone: "9111111111",
    });

    patientId = patient._id;

    const doctor = await DoctorModel.create({
      hospitalId,
      hospitalAdminId: adminId,
      name: "Dr Rx",
      email: "dr-rx@hospital.com",
      phone: "9222222222",
      specialization: "General",
    });

    doctorId = doctor._id;
  });

  afterAll(async () => {
    await PrescriptionModel.deleteMany({});
    await PatientModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await HospitalAdminModel.deleteMany({});
    await HospitalModel.deleteMany({});
    await disconnectDB();
  });

  it("❌ should fail without required fields", async () => {
    await expect(PrescriptionModel.create({})).rejects.toThrow();
  });

  it("❌ should reject empty medicines array", async () => {
    await expect(
      PrescriptionModel.create({
        hospitalId,
        patientId,
        doctorId,
        medicines: [],
      })
    ).rejects.toThrow();
  });

  it("❌ should reject invalid status", async () => {
    await expect(
      PrescriptionModel.create({
        hospitalId,
        patientId,
        doctorId,
        status: "INVALID_STATUS",
        medicines: [
          {
            name: "Paracetamol",
            dosage: "500mg",
            frequency: "2x",
            durationDays: 3,
          },
        ],
      })
    ).rejects.toThrow();
  });

  it("✅ should create prescription with valid data", async () => {
    const rx = await PrescriptionModel.create({
      hospitalId,
      patientId,
      doctorId,
      status: PrescriptionStatus.COMPLETED,
      medicines: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "2x",
          durationDays: 3,
        },
      ],
    });

    expect(rx).toBeDefined();
  });
});
