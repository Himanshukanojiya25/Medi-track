import mongoose, { Types } from "mongoose";
import HospitalAdminDoctorsStatsService from
  "../../../src/services/hospital-admin/hospital-admin.doctors.stats.service";
import { DoctorModel } from "../../../src/models/doctor";
import { AppointmentModel } from "../../../src/models/appointment";
import { AppointmentStatus } from "../../../src/constants/status";

describe("HospitalAdminDoctorsStatsService", () => {
  const hospitalId = new Types.ObjectId();
  const doctorId = new Types.ObjectId();
  const patientId = new Types.ObjectId();

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterEach(async () => {
    await DoctorModel.deleteMany({});
    await AppointmentModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("returns doctor stats correctly", async () => {
    await DoctorModel.create({
      _id: doctorId,
      hospitalId,
      hospitalAdminId: new Types.ObjectId(),
      name: "Dr Stats",
      email: "stats@test.com",
      passwordHash: "hashed",
      specialization: "Cardiology",
      isActive: true,
    });

    // ✅ COMPLETED + PAST + NOT CANCELLED
    await AppointmentModel.create({
      hospitalId,
      doctorId,
      patientId,
      scheduledAt: new Date(Date.now() - 60 * 60 * 1000), // past
      durationMinutes: 30,
      status: AppointmentStatus.COMPLETED,
      cancelledAt: null,
    });

    const result =
      await HospitalAdminDoctorsStatsService.getStats({ hospitalId });

    expect(result.totalDoctors).toBe(1);
    expect(result.activeDoctors).toBe(1);
    expect(result.doctors[0].completed).toBe(1);
  });
});
