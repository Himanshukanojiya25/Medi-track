import { PatientModel } from "../../../../src/models/patient";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { PatientStatus } from "../../../../src/constants/status";

describe("Patient Schema Validation", () => {
  let hospitalId: any;
  let adminId: any;

  beforeAll(async () => {
    await PatientModel.init();

    const hospital = await HospitalModel.create({
      name: "Patient Schema Hospital",
      code: "PAT-SCHEMA-HOSP",
      email: "pat-schema@hospital.com",
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

    const admin = await HospitalAdminModel.create({
      name: "Patient Schema Admin",
      hospitalId,
      email: "pat-admin@hospital.com",
      passwordHash: "hashed-password",
    });

    adminId = admin._id;
  });

  it("❌ should fail without required fields", async () => {
    await expect(PatientModel.create({})).rejects.toThrow();
  });

  it("❌ should fail without passwordHash", async () => {
    await expect(
      PatientModel.create({
        hospitalId,
        createdByHospitalAdminId: adminId,
        firstName: "NoPass",
        lastName: "Patient",
        phone: "9999999999",
      })
    ).rejects.toThrow(/passwordHash/);
  });

  it("✅ should create patient with valid data", async () => {
    const patient = await PatientModel.create({
      hospitalId,
      createdByHospitalAdminId: adminId,
      firstName: "Valid",
      lastName: "Patient",
      phone: "8888888888",
      passwordHash: "hashed-password",
      gender: "male",
      status: PatientStatus.ACTIVE,
    });

    expect(patient).toBeDefined();
    expect(patient.status).toBe(PatientStatus.ACTIVE);
  });
});
