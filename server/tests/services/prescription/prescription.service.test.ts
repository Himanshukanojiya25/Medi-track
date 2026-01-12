import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import PrescriptionService from "../../../src/services/prescription/prescription.service";

import { PrescriptionModel } from "../../../src/models/prescription";
import { HospitalModel } from "../../../src/models/hospital";
import { HospitalAdminModel } from "../../../src/models/hospital-admin";
import { DoctorModel } from "../../../src/models/doctor";
import { PatientModel } from "../../../src/models/patient";

describe("Prescription Service", () => {
  beforeAll(async () => {
    await connectDB();

    await PrescriptionModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await PatientModel.deleteMany({});
    await HospitalAdminModel.deleteMany({});
    await HospitalModel.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDB();
  });

  let prescriptionId: string;
  let hospitalId: string;
  let hospitalAdminId: string;
  let doctorId: string;
  let patientId: string;

  it("setup hospital, admin, doctor & patient", async () => {
    const hospital = await HospitalModel.create({
      name: "Prescription Test Hospital",
      code: "PRES-HOSP-001",
      email: "pres-hospital@test.com",
      phone: "9999999999",
      address: {
        line1: "MG Road",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });
    hospitalId = hospital._id.toString();

    const admin = await HospitalAdminModel.create({
      hospitalId,
      name: "Prescription Admin",
      email: "pres-admin@test.com",
      passwordHash: "hashed-password-123",
    });
    hospitalAdminId = admin._id.toString();

    const doctor = await DoctorModel.create({
      hospitalId,
      hospitalAdminId,
      name: "Dr Prescription",
      email: "dr-pres@test.com",
      phone: "8888888888",
      specialization: "General",
    });
    doctorId = doctor._id.toString();

    const patient = await PatientModel.create({
      hospitalId,
      createdByHospitalAdminId: hospitalAdminId,
      firstName: "Test",
      lastName: "Patient",
      phone: "7777777777",
      gender: "male",
      status: "active",
    });
    patientId = patient._id.toString();

    expect(hospitalId).toBeDefined();
    expect(hospitalAdminId).toBeDefined();
    expect(doctorId).toBeDefined();
    expect(patientId).toBeDefined();
  });

  it("should create prescription", async () => {
    const result = await PrescriptionService.create({
      hospitalId,
      doctorId,
      patientId,
      medicines: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "Twice a day",
          durationDays: 5, // ✅ REQUIRED BY SCHEMA
        },
      ],
      notes: "After meals",
    });

    prescriptionId = result._id.toString();
    expect(prescriptionId).toBeDefined();
  });

  it("should get prescription by id", async () => {
    const result = await PrescriptionService.getById(prescriptionId);
    expect(result).not.toBeNull();
  });

  it("should get prescriptions by patient", async () => {
    const result = await PrescriptionService.getByPatient(patientId);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should get prescriptions by doctor", async () => {
    const result = await PrescriptionService.getByDoctor(doctorId);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should update prescription", async () => {
    const result = await PrescriptionService.updateById(prescriptionId, {
      notes: "Updated notes",
    });

    expect(result).not.toBeNull();
  });

  it("should cancel prescription", async () => {
    const result = await PrescriptionService.cancelById(prescriptionId);
    expect(result?.status).toBe("cancelled");
  });

  it("should throw error for invalid id", async () => {
    await expect(
      PrescriptionService.getById("invalid-id")
    ).rejects.toThrow("Invalid Prescription ID");
  });
});
