import { Types } from "mongoose";
import DoctorListForPatientService from "../../../src/services/doctor/doctor.list-for-patient.service";
import { DoctorModel } from "../../../src/models/doctor";

describe("Doctor Service – Patient Listing (Option A)", () => {
  const hospitalId = new Types.ObjectId().toString();
  const department1 = new Types.ObjectId().toString();
  const department2 = new Types.ObjectId().toString();

  beforeEach(async () => {
    await DoctorModel.deleteMany({});

    await DoctorModel.create([
      {
        hospitalId,
        departmentId: department1,
        name: "Dr Rajesh",
        specialization: "Cardiologist",
        email: "rajesh@test.com",
        hospitalAdminId: new Types.ObjectId(),
        passwordHash: "hashed",
        isActive: true,
      },
      {
        hospitalId,
        departmentId: department2,
        name: "Dr Amit",
        specialization: "Orthopedic",
        email: "amit@test.com",
        hospitalAdminId: new Types.ObjectId(),
        passwordHash: "hashed",
        isActive: true,
      },
      {
        hospitalId,
        departmentId: department1,
        name: "Dr Inactive",
        specialization: "Cardio",
        email: "inactive@test.com",
        hospitalAdminId: new Types.ObjectId(),
        passwordHash: "hashed",
        isActive: false,
      },
    ]);
  });

  it("should return only active doctors", async () => {
    const result =
      await DoctorListForPatientService.list({ hospitalId });

    expect(result).toHaveLength(2);
  });

  it("should filter doctors by departmentId", async () => {
    const result =
      await DoctorListForPatientService.list({
        hospitalId,
        departmentId: department1,
      });

    expect(result).toHaveLength(1);
    expect(result[0].specialization).toBe("Cardiologist");
  });

  it("should return empty array if no match", async () => {
    const result =
      await DoctorListForPatientService.list({
        hospitalId,
        departmentId: new Types.ObjectId().toString(),
      });

    expect(result).toEqual([]);
  });

  it("should not expose sensitive fields", async () => {
    const result =
      await DoctorListForPatientService.list({ hospitalId });

    expect(result[0]).not.toHaveProperty("passwordHash");
    expect(result[0]).not.toHaveProperty("email");
    expect(result[0]).not.toHaveProperty("hospitalAdminId");
  });
});
