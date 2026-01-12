import { DoctorModel } from "../../../../src/models/doctor";
import { setupTestDB, teardownTestDB } from "../../../helpers";
import { Types } from "mongoose";

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("Doctor Schema Validation", () => {
  it("should fail without hospitalId", async () => {
    await expect(
      DoctorModel.create({
        hospitalAdminId: new Types.ObjectId(),
        name: "Doc",
        email: "a@a.com",
        specialization: "Gen",
      } as any)
    ).rejects.toThrow();
  });

  it("should fail without email", async () => {
    await expect(
      DoctorModel.create({
        hospitalId: new Types.ObjectId(),
        hospitalAdminId: new Types.ObjectId(),
        name: "Doc",
        specialization: "Gen",
      } as any)
    ).rejects.toThrow();
  });
});
