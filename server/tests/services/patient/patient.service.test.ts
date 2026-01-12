import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import PatientService from "../../../src/services/patient/patient.service";
import { PatientModel } from "../../../src/models/patient";
import { HospitalModel } from "../../../src/models/hospital";
import { HospitalAdminModel } from "../../../src/models/hospital-admin";

describe("Patient Service", () => {
  beforeAll(async () => {
    await connectDB();
    await PatientModel.deleteMany({});
    await HospitalModel.deleteMany({});
    // ❌ DO NOT delete HospitalAdminModel (appointment tests depend on it)
  });

  afterAll(async () => {
    await disconnectDB();
  });

  let patientId: string;
  let hospitalId: string;
  let hospitalAdminId: string;

  it("should create a hospital", async () => {
    const hospital = await HospitalModel.create({
      name: "Patient Test Hospital",
      code: "PAT-HOSP-002",
      email: "pathospital2@test.com",
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
    expect(hospitalId).toBeDefined();
  });

  it("should create a hospital admin (creator)", async () => {
    const admin = await HospitalAdminModel.create({
      name: "Patient Creator Admin",
      hospitalId,
      email: "patientadmin@test.com",
      passwordHash: "hashed-password-123",
    });

    hospitalAdminId = admin._id.toString();
    expect(hospitalAdminId).toBeDefined();
  });

it("should create a patient", async () => {
  const result = await PatientService.create({
    hospitalId,
    createdByHospitalAdminId: hospitalAdminId,
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul@test.com",
    phone: "8888888888",
    gender: "male", // ✅ CORRECT ENUM
    age: 30,
  });

  expect(result).toBeDefined();
  expect(result._id).toBeDefined();

  patientId = result._id.toString();
});


  it("should get patient by id", async () => {
    const result = await PatientService.getById(patientId);
    expect(result).not.toBeNull();
  });

  it("should get all patients", async () => {
    const result = await PatientService.getAll();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should get patients by hospital", async () => {
    const result = await PatientService.getByHospital(hospitalId);
    expect(result.length).toBeGreaterThan(0);
  });

 // UPDATE TEST
it("should update patient by id", async () => {
  const result = await PatientService.updateById(patientId, {
    age: 31,
  });

  expect(result).not.toBeNull();
  expect(result?._id.toString()).toBe(patientId);
});

// DEACTIVATE TEST
it("should deactivate patient", async () => {
  const result = await PatientService.deactivateById(patientId);
  expect(result?.status).toBe("inactive");
});


  it("should throw error for invalid id", async () => {
    await expect(
      PatientService.getById("invalid-id")
    ).rejects.toThrow("Invalid Patient ID");
  });
});
