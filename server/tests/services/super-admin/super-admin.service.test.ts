import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import SuperAdminService from "../../../src/services/super-admin/super-admin.service";
import { SuperAdminModel } from "../../../src/models/super-admin";

describe("Super Admin Service", () => {
  beforeAll(async () => {
    await connectDB();
    await SuperAdminModel.deleteMany({}); // 🔥 CLEAN STATE
  });

  afterAll(async () => {
    await disconnectDB();
  });

  let superAdminId: string;

  it("should create a super admin", async () => {
    const result = await SuperAdminService.create({
      email: "admin@test.com",
      passwordHash: "hashed-password-123",
    });

    expect(result).toBeDefined();
    expect(result._id).toBeDefined();

    superAdminId = result._id.toString();
  });

  it("should get super admin by id", async () => {
    const result = await SuperAdminService.getById(superAdminId);

    expect(result).not.toBeNull();
    expect(result?._id.toString()).toBe(superAdminId);
  });

  it("should get all super admins", async () => {
    const result = await SuperAdminService.getAll();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should update super admin by id", async () => {
    const result = await SuperAdminService.updateById(superAdminId, {
      isActive: false,
    });

    expect(result).not.toBeNull();
    expect(result?.isActive).toBe(false);
  });

  it("should delete super admin by id", async () => {
    const result = await SuperAdminService.deleteById(superAdminId);

    expect(result).not.toBeNull();
  });

  it("should throw error for invalid id", async () => {
    await expect(
      SuperAdminService.getById("invalid-id")
    ).rejects.toThrow("Invalid Super Admin ID");
  });
});
