import mongoose, { Types } from "mongoose";
import HospitalAdminAppointmentsService from
  "../../../src/services/hospital-admin/hospital-admin.appointments.service";
import { AppointmentModel } from "../../../src/models/appointment";
import { DoctorModel } from "../../../src/models/doctor";
import { PatientModel } from "../../../src/models/patient";
import { AppointmentStatus, PatientStatus } from "../../../src/constants/status";

describe("HospitalAdminAppointmentsService", () => {
  const hospitalId = new Types.ObjectId();
  const doctorId = new Types.ObjectId();
  const patientId = new Types.ObjectId();

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterEach(async () => {
    await AppointmentModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await PatientModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("lists appointments for hospital", async () => {
    await DoctorModel.create({
      _id: doctorId,
      hospitalId,
      hospitalAdminId: new Types.ObjectId(),
      name: "Dr Test",
      email: "dr@test.com",
      passwordHash: "hashed",
      specialization: "General Medicine",
      isActive: true,
    });

    await PatientModel.create({
      _id: patientId,
      hospitalId,
      phone: "9999999999",
      passwordHash: "hashed",
      status: PatientStatus.ACTIVE,
      isBlocked: false,
    });

    await AppointmentModel.create({
      hospitalId,
      doctorId,
      patientId,
      scheduledAt: new Date(),
      durationMinutes: 30,
      status: AppointmentStatus.SCHEDULED,
    });

    const result =
      await HospitalAdminAppointmentsService.list({ hospitalId });

    expect(result.items.length).toBe(1);
    expect(result.pagination.total).toBe(1);
  });
});
