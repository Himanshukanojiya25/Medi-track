import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import HospitalAdminService from "../../../src/services/hospital-admin/hospital-admin.service";
import { HospitalAdminModel } from "../../../src/models/hospital-admin";
import { Types } from "mongoose";

describe("Hospital Admin Service", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await HospitalAdminModel.deleteMany({});
    await disconnectDB();
  });

  let hospitalAdminId: string;
  const hospitalId = new Types.ObjectId().toString();

  it("should create a hospital admin", async () => {
    const result = await HospitalAdminService.create({
      name: "Main Hospital Admin", // ✅ REQUIRED
      hospitalId,
      email: "hospitaladmin@test.com",
      passwordHash: "hashed-password-123",
    });

    expect(result).toBeDefined();
    expect(result._id).toBeDefined();

    hospitalAdminId = result._id.toString();
  });

  it("should get hospital admin by id", async () => {
    const result = await HospitalAdminService.getById(hospitalAdminId);
    expect(result).not.toBeNull();
  });

  it("should get all hospital admins", async () => {
    const result = await HospitalAdminService.getAll();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should update hospital admin by id", async () => {
    const result = await HospitalAdminService.updateById(hospitalAdminId, {
      isActive: false,
    });

    expect(result?.isActive).toBe(false);
  });

  it("should delete hospital admin by id", async () => {
    const result = await HospitalAdminService.deleteById(hospitalAdminId);
    expect(result).not.toBeNull();
  });

  it("should throw error for invalid id", async () => {
    await expect(
      HospitalAdminService.getById("invalid-id")
    ).rejects.toThrow("Invalid Hospital Admin ID");
  });
});
