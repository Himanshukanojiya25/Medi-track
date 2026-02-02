import mongoose, { Types } from "mongoose";
import HospitalAdminUsersControlService from
  "../../../src/services/hospital-admin/hospital-admin.users.control.service";
import { DoctorModel } from "../../../src/models/doctor";
import { PatientModel } from "../../../src/models/patient";
import { PatientStatus } from "../../../src/constants/status";

describe("HospitalAdminUsersControlService", () => {
  const hospitalId = new Types.ObjectId();
  const doctorId = new Types.ObjectId();
  const patientId = new Types.ObjectId();

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterEach(async () => {
    await DoctorModel.deleteMany({});
    await PatientModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("deactivates doctor", async () => {
    await DoctorModel.create({
      _id: doctorId,
      hospitalId,
      hospitalAdminId: new Types.ObjectId(),
      name: "Dr Block",
      email: "block@test.com",
      passwordHash: "hashed",
      specialization: "Orthopedic",
      isActive: true,
    });

    const doctor =
      await HospitalAdminUsersControlService.updateDoctorStatus({
        hospitalId,
        doctorId,
        isActive: false,
      });

    expect(doctor.isActive).toBe(false);
  });

  it("blocks patient", async () => {
    await PatientModel.create({
      _id: patientId,
      hospitalId,
      phone: "8888888888",
      passwordHash: "hashed",
      status: PatientStatus.ACTIVE,
      isBlocked: false,
    });

    const patient =
      await HospitalAdminUsersControlService.updatePatientStatus({
        hospitalId,
        patientId,
        isBlocked: true,
      });

    expect(patient.isBlocked).toBe(true);
  });
});
