import mongoose, { Types } from "mongoose";
import AppointmentCompleteService from "../../../src/services/appointment/appointment.complete.service";
import { AppointmentModel } from "../../../src/models/appointment";
import { DoctorModel } from "../../../src/models/doctor";
import { AppointmentStatus } from "../../../src/constants/status";
import { HttpError } from "../../../src/utils/response/http-error";

describe("AppointmentCompleteService.complete", () => {
  const hospitalId = new Types.ObjectId();
  const patientId = new Types.ObjectId();
  const doctorId = new Types.ObjectId();
  const otherDoctorId = new Types.ObjectId();

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterEach(async () => {
    await AppointmentModel.deleteMany({});
    await DoctorModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  async function createDoctor(id: Types.ObjectId, email: string) {
    await DoctorModel.create({
      _id: id,
      hospitalId,
      hospitalAdminId: new Types.ObjectId(),
      name: "Dr Complete Test",
      email,
      passwordHash: "hashed-password",
      specialization: "General",
    });
  }

  it("should complete appointment successfully (happy path)", async () => {
    await createDoctor(doctorId, "complete@test.com");

    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() - 30 * 60 * 1000), // past
      durationMinutes: 30,
      status: AppointmentStatus.SCHEDULED,
    });

    const completed = await AppointmentCompleteService.complete({
      appointmentId: appointment._id,
      doctorId,
    });

    expect(completed.status).toBe(AppointmentStatus.COMPLETED);
  });

  it("should fail if appointment does not exist", async () => {
    await createDoctor(doctorId, "complete@test.com");

    await expect(
      AppointmentCompleteService.complete({
        appointmentId: new Types.ObjectId(),
        doctorId,
      })
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("should fail if doctor tries to complete someone else's appointment", async () => {
    await createDoctor(doctorId, "doctor1@test.com");
    await createDoctor(otherDoctorId, "doctor2@test.com");

    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() - 30 * 60 * 1000),
      durationMinutes: 30,
      status: AppointmentStatus.SCHEDULED,
    });

    await expect(
      AppointmentCompleteService.complete({
        appointmentId: appointment._id,
        doctorId: otherDoctorId,
      })
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("should fail if appointment is already cancelled", async () => {
    await createDoctor(doctorId, "complete@test.com");

    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() - 30 * 60 * 1000),
      durationMinutes: 30,
      status: AppointmentStatus.CANCELLED,
    });

    await expect(
      AppointmentCompleteService.complete({
        appointmentId: appointment._id,
        doctorId,
      })
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("should fail if appointment is already completed", async () => {
    await createDoctor(doctorId, "complete@test.com");

    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() - 30 * 60 * 1000),
      durationMinutes: 30,
      status: AppointmentStatus.COMPLETED,
    });

    await expect(
      AppointmentCompleteService.complete({
        appointmentId: appointment._id,
        doctorId,
      })
    ).rejects.toBeInstanceOf(HttpError);
  });
});
