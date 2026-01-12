import { HospitalModel } from "../../../../src/models/hospital";
import { setupTestDB, teardownTestDB } from "../../../helpers";

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("Hospital Schema Validation", () => {
  it("should fail without name", async () => {
    await expect(
      HospitalModel.create({
        code: "H1",
        email: "a@a.com",
        phone: "123",
      } as any)
    ).rejects.toThrow();
  });
});
