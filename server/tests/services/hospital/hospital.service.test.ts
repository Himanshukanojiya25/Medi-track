import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import HospitalService from "../../../src/services/hospital/hospital.service";
import { HospitalModel } from "../../../src/models/hospital";

describe("Hospital Service", () => {
  beforeAll(async () => {
    await connectDB();
    await HospitalModel.deleteMany({}); // clean state
  });

  afterAll(async () => {
    await disconnectDB();
  });

  let hospitalId: string;

  it("should create a hospital", async () => {
    const result = await HospitalService.create({
      name: "City Hospital",
      code: "CITY-HOSP-001",
      email: "cityhospital@test.com",
      phone: "9999999999", // ✅ REQUIRED FIELD (MISSING THA)
      address: {
        line1: "MG Road",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });

    expect(result).toBeDefined();
    expect(result._id).toBeDefined();

    hospitalId = result._id.toString();
  });

  it("should get hospital by id", async () => {
    const result = await HospitalService.getById(hospitalId);
    expect(result).not.toBeNull();
    expect(result?._id.toString()).toBe(hospitalId);
  });

  it("should get all hospitals", async () => {
    const result = await HospitalService.getAll();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should update hospital by id", async () => {
    const result = await HospitalService.updateById(hospitalId, {
      name: "Updated City Hospital",
    });

    expect(result).not.toBeNull();
    expect(result?.name).toBe("Updated City Hospital");
  });

  it("should deactivate hospital", async () => {
    const result = await HospitalService.deactivateById(hospitalId);

    expect(result).not.toBeNull();
    expect(result?.status).toBe("INACTIVE");
  });

  it("should throw error for invalid id", async () => {
    await expect(
      HospitalService.getById("invalid-id")
    ).rejects.toThrow("Invalid Hospital ID");
  });
});
