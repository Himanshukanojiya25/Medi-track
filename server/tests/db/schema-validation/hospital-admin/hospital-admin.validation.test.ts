import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { HospitalModel } from "../../../../src/models/hospital";
import { HOSPITAL_ADMIN_STATUS } from "../../../../src/constants/status";
import { ROLES } from "../../../../src/constants/roles";

describe("Hospital Admin Schema Validation", () => {
  let hospitalId: string;

  beforeAll(async () => {
    await connectDB();
    await HospitalAdminModel.deleteMany({});
    await HospitalModel.deleteMany({});

    const hospital = await HospitalModel.create({
      name: "Admin Schema Hospital",
      code: "ADMIN-SCHEMA-HOSP",
      email: "admin-schema@hospital.com",
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
  });

  afterAll(async () => {
    await HospitalAdminModel.deleteMany({});
    await HospitalModel.deleteMany({});
    await disconnectDB();
  });

  it("❌ should fail without required fields", async () => {
    await expect(HospitalAdminModel.create({})).rejects.toThrow();
  });

  it("❌ should fail without passwordHash", async () => {
    await expect(
      HospitalAdminModel.create({
        name: "No Password Admin",
        hospitalId,
        email: "nopass@hospital.com",
      })
    ).rejects.toThrow();
  });

  it("❌ should reject invalid status", async () => {
    await expect(
      HospitalAdminModel.create({
        name: "Invalid Status Admin",
        hospitalId,
        email: "invalid@hospital.com",
        passwordHash: "hashed-password",
        status: "INVALID_STATUS",
      })
    ).rejects.toThrow();
  });

  it("✅ should create hospital admin with valid data", async () => {
    const admin = await HospitalAdminModel.create({
      name: "Valid Admin",
      hospitalId,
      email: "valid@hospital.com",
      passwordHash: "hashed-password",
      role: ROLES.HOSPITAL_ADMIN,
      status: HOSPITAL_ADMIN_STATUS.ACTIVE,
    });

    expect(admin).toBeDefined();
    expect(admin.role).toBe(ROLES.HOSPITAL_ADMIN);
    expect(admin.status).toBe(HOSPITAL_ADMIN_STATUS.ACTIVE);
  });
});
