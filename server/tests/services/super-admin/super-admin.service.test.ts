import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import SuperAdminService from "../../../src/services/super-admin/super-admin.service";
import { SuperAdminModel } from "../../../src/models/super-admin";

describe("Super Admin Service", () => {
  let superAdminId: string;

  beforeAll(async () => {
    await connectDB();
    await SuperAdminModel.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it("should create super admin", async () => {
    const result = await SuperAdminService.create({
      email: "admin@test.com",
      passwordHash: "hashed",
    });

    superAdminId = result._id.toString();
    expect(result).toBeDefined();
  });

  it("should get super admin by id", async () => {
    const admin = await SuperAdminService.getById(superAdminId);
    expect(admin).not.toBeNull();
  });

  it("should get all super admins", async () => {
    const result = await SuperAdminService.getAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should update super admin", async () => {
    await SuperAdminService.updateById(superAdminId, {
      isActive: false,
    });

    const fresh = await SuperAdminModel.findById(superAdminId).lean();
    expect(fresh?.isActive).toBe(false);
  });

  it("should delete super admin", async () => {
    await SuperAdminService.deleteById(superAdminId);

    const deleted = await SuperAdminService.getById(superAdminId);
    expect(deleted).toBeNull();
  });
});
