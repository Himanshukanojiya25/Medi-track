import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { setupTestDB, teardownTestDB } from "../../../helpers";
import { Types } from "mongoose";

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("HospitalAdmin Schema Validation", () => {
  it("should fail without hospitalId", async () => {
    await expect(
      HospitalAdminModel.create({
        name: "Test",
        email: "a@a.com",
        passwordHash: "hash",
      } as any)
    ).rejects.toThrow();
  });

  it("should fail without email", async () => {
    await expect(
      HospitalAdminModel.create({
        hospitalId: new Types.ObjectId(),
        name: "Test",
        passwordHash: "hash",
      } as any)
    ).rejects.toThrow();
  });
});
