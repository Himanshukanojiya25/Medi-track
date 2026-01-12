import { connectDB, disconnectDB } from "../../../../src/config";
import { PatientModel } from "../../../../src/models/patient";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { PatientStatus } from "../../../../src/constants/status";
import { SYSTEM_ROLES } from "../../../../src/constants/roles";

describe("Patient Schema Validation", () => {
  let hospitalId: any;
  let adminId: any;

  beforeAll(async () => {
    await connectDB();

    let hospital = await HospitalModel.findOne({});
    if (!hospital) {
      hospital = await HospitalModel.create({
        name: "Test Hospital",
        code: "PAT-HOSP",
        email: "pat@hospital.com",
        phone: "9000000001",

        // ✅ REQUIRED ADDRESS (FIX)
        address: {
          line1: "Test Street",
          city: "Mumbai",
          state: "MH",
          country: "India",
          postalCode: "400001",
        },
      });
    }
    hospitalId = hospital._id;

    let admin = await HospitalAdminModel.findOne({ hospitalId });
    if (!admin) {
      admin = await HospitalAdminModel.create({
        hospitalId,
        name: "Patient Admin",
        email: "patient-admin@hospital.com",
        passwordHash: "hashed",
        role: SYSTEM_ROLES.HOSPITAL_ADMIN,
      });
    }
    adminId = admin._id;
  });

  afterAll(async () => {
    await PatientModel.deleteMany({});
    await disconnectDB();
  });

  it("❌ should fail without required fields", async () => {
    await expect(PatientModel.create({})).rejects.toThrow();
  });

  it("❌ should fail without hospitalId", async () => {
    await expect(
      PatientModel.create({
        createdByHospitalAdminId: adminId,
        firstName: "Test",
        lastName: "Patient",
        phone: "1111111111",
      })
    ).rejects.toThrow();
  });

  it("❌ should fail without phone", async () => {
    await expect(
      PatientModel.create({
        hospitalId,
        createdByHospitalAdminId: adminId,
        firstName: "Test",
        lastName: "Patient",
      })
    ).rejects.toThrow();
  });

  it("❌ should reject invalid status", async () => {
    await expect(
      PatientModel.create({
        hospitalId,
        createdByHospitalAdminId: adminId,
        firstName: "Test",
        lastName: "Patient",
        phone: "2222222222",
        status: "INVALID_STATUS",
      })
    ).rejects.toThrow();
  });

  it("✅ should create patient with valid data", async () => {
    const patient = await PatientModel.create({
      hospitalId,
      createdByHospitalAdminId: adminId,
      firstName: "Valid",
      lastName: "Patient",
      phone: "3333333333",
      status: PatientStatus.ACTIVE,
    });

    expect(patient).toBeDefined();
  });
});
