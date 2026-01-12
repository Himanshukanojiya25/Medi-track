import { SuperAdminModel } from "../../../../src/models/super-admin";
import { setupTestDB, teardownTestDB } from "../../../helpers";

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("SuperAdmin Schema Validation", () => {
  it("should fail without email", async () => {
    await expect(
      SuperAdminModel.create({
        passwordHash: "hash",
      } as any)
    ).rejects.toThrow();
  });

  it("should fail without passwordHash", async () => {
    await expect(
      SuperAdminModel.create({
        email: "test@test.com",
      } as any)
    ).rejects.toThrow();
  });
});
