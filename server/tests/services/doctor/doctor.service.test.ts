import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import DoctorService from "../../../src/services/doctor/doctor.service";
import { DoctorModel } from "../../../src/models/doctor";
import { HospitalModel } from "../../../src/models/hospital";
import { HospitalAdminModel } from "../../../src/models/hospital-admin";

describe("Doctor Service", () => {
  beforeAll(async () => {
    await connectDB();
    await DoctorModel.deleteMany({});
    await HospitalModel.deleteMany({});
    await HospitalAdminModel.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDB();
  });

  let doctorId: string;
  let hospitalId: string;
  let hospitalAdminId: string;

  it("should create a hospital", async () => {
    const hospital = await HospitalModel.create({
      name: "Doctor Test Hospital",
      code: "DOC-HOSP-001",
      email: "dochospital@test.com",
      phone: "9999999999",
      address: {
        line1: "MG Road",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });

    hospitalId = hospital._id.toString();
    expect(hospitalId).toBeDefined();
  });

  it("should create a hospital admin for doctor", async () => {
    const hospitalAdmin = await HospitalAdminModel.create({
      name: "Doctor Creator Admin",
      hospitalId,
      email: "docadmin@test.com",
      passwordHash: "hashed-password-123",
    });

    hospitalAdminId = hospitalAdmin._id.toString();
    expect(hospitalAdminId).toBeDefined();
  });

  it("should create a doctor", async () => {
    const result = await DoctorService.create({
      hospitalId,
      hospitalAdminId,
      name: "Dr. John Doe",
      email: "doctor@test.com",
      specialization: "Cardiology",
      phone: "8888888888",
    });

    expect(result).toBeDefined();
    expect(result._id).toBeDefined();

    doctorId = result._id.toString();
  });

  it("should get doctor by id", async () => {
    const result = await DoctorService.getById(doctorId);

    expect(result).not.toBeNull();
    expect(result?._id.toString()).toBe(doctorId);
  });

  it("should get all doctors", async () => {
    const result = await DoctorService.getAll();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should update doctor by id", async () => {
    const result = await DoctorService.updateById(doctorId, {
      isActive: false,
    });

    expect(result).not.toBeNull();
    expect(result?.isActive).toBe(false);
  });

  it("should delete doctor by id", async () => {
    const result = await DoctorService.deleteById(doctorId);

    expect(result).not.toBeNull();
  });

  it("should throw error for invalid id", async () => {
    await expect(
      DoctorService.getById("invalid-id")
    ).rejects.toThrow("Invalid Doctor ID");
  });
});
