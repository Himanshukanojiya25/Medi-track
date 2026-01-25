import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { DoctorModel } from "../../../../src/models/doctor";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { DOCTOR_STATUS } from "../../../../src/constants/status";
import { ROLES } from "../../../../src/constants/roles";

describe("Doctor Schema Validation", () => {
  let hospitalId: string;
  let adminId: string;

  beforeAll(async () => {
    await connectDB();
    await DoctorModel.deleteMany({});
    await HospitalAdminModel.deleteMany({});
    await HospitalModel.deleteMany({});

    const hospital = await HospitalModel.create({
      name: "Doctor Schema Hospital",
      code: "DOC-SCHEMA-HOSP",
      email: "doc-schema@hospital.com",
      phone: "9999999999",
      address: {
        line1: "Street",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });
    hospitalId = hospital._id.toString();

    const admin = await HospitalAdminModel.create({
      name: "Doctor Schema Admin",
      hospitalId,
      email: "doc-admin@hospital.com",
      passwordHash: "hashed-password",
    });
    adminId = admin._id.toString();
  });

  afterAll(async () => {
    await DoctorModel.deleteMany({});
    await HospitalAdminModel.deleteMany({});
    await HospitalModel.deleteMany({});
    await disconnectDB();
  });

  it("❌ should fail without required fields", async () => {
    await expect(DoctorModel.create({})).rejects.toThrow();
  });

  it("❌ should fail without passwordHash", async () => {
    await expect(
      DoctorModel.create({
        hospitalId,
        hospitalAdminId: adminId,
        name: "No Password Doctor",
        email: "nopass@doctor.com",
        specialization: "General",
      })
    ).rejects.toThrow();
  });

  it("❌ should reject invalid status", async () => {
    await expect(
      DoctorModel.create({
        hospitalId,
        hospitalAdminId: adminId,
        name: "Invalid Status Doctor",
        email: "invalid@doctor.com",
        specialization: "General",
        passwordHash: "hashed",
        status: "INVALID_STATUS",
      })
    ).rejects.toThrow();
  });

  it("✅ should create doctor with valid data", async () => {
    const doctor = await DoctorModel.create({
      hospitalId,
      hospitalAdminId: adminId,
      name: "Valid Doctor",
      email: "valid@doctor.com",
      specialization: "General",
      passwordHash: "hashed-password",
      role: ROLES.DOCTOR,
      status: DOCTOR_STATUS.ACTIVE,
    });

    expect(doctor).toBeDefined();
    expect(doctor.role).toBe(ROLES.DOCTOR);
    expect(doctor.status).toBe(DOCTOR_STATUS.ACTIVE);
  });
});
