import mongoose, { Types } from "mongoose";
import AppointmentCancelService from "../../../src/services/appointment/appointment.cancel.service";
import { AppointmentModel } from "../../../src/models/appointment";
import { DoctorModel } from "../../../src/models/doctor";
import { AppointmentStatus } from "../../../src/constants/status";
import { HttpError } from "../../../src/utils/response/http-error";

describe("AppointmentCancelService.cancel", () => {
  const hospitalId = new Types.ObjectId();
  const patientId = new Types.ObjectId();
  const otherPatientId = new Types.ObjectId();
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
      name: "Dr Cancel Test",
      email,
      passwordHash: "hashed-password",
      specialization: "General",
    });
  }

  it("should allow PATIENT to cancel appointment (happy path)", async () => {
    await createDoctor(doctorId, "cancel@test.com");

    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000), // future
      durationMinutes: 30,
      status: AppointmentStatus.SCHEDULED,
    });

    const cancelled = await AppointmentCancelService.cancel({
      appointmentId: appointment._id,
      cancelledById: patientId,
      cancelledByRole: "PATIENT",
      reason: "Feeling better",
    });

    expect(cancelled.status).toBe(AppointmentStatus.CANCELLED);
    expect(cancelled.cancelledBy?.toString()).toBe(patientId.toString());
    expect(cancelled.cancelledReason).toBe("Feeling better");
  });

  it("should allow DOCTOR to cancel appointment", async () => {
    await createDoctor(doctorId, "doctor@test.com");

    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
      durationMinutes: 30,
      status: AppointmentStatus.SCHEDULED,
    });

    const cancelled = await AppointmentCancelService.cancel({
      appointmentId: appointment._id,
      cancelledById: doctorId,
      cancelledByRole: "DOCTOR",
      reason: "Emergency leave",
    });

    expect(cancelled.status).toBe(AppointmentStatus.CANCELLED);
    expect(cancelled.cancelledBy?.toString()).toBe(doctorId.toString());
  });

  it("should fail if cancel reason is missing", async () => {
    await createDoctor(doctorId, "cancel@test.com");

    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
      durationMinutes: 30,
      status: AppointmentStatus.SCHEDULED,
    });

    await expect(
      AppointmentCancelService.cancel({
        appointmentId: appointment._id,
        cancelledById: patientId,
        cancelledByRole: "PATIENT",
        reason: "",
      })
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("should fail if patient tries to cancel someone else's appointment", async () => {
    await createDoctor(doctorId, "cancel@test.com");

    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
      durationMinutes: 30,
      status: AppointmentStatus.SCHEDULED,
    });

    await expect(
      AppointmentCancelService.cancel({
        appointmentId: appointment._id,
        cancelledById: otherPatientId,
        cancelledByRole: "PATIENT",
        reason: "Not mine",
      })
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("should fail if doctor tries to cancel another doctor's appointment", async () => {
    await createDoctor(doctorId, "doctor1@test.com");
    await createDoctor(otherDoctorId, "doctor2@test.com");

    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
      durationMinutes: 30,
      status: AppointmentStatus.SCHEDULED,
    });

    await expect(
      AppointmentCancelService.cancel({
        appointmentId: appointment._id,
        cancelledById: otherDoctorId,
        cancelledByRole: "DOCTOR",
        reason: "Not my patient",
      })
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("should fail if appointment is already cancelled", async () => {
    await createDoctor(doctorId, "cancel@test.com");

    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
      durationMinutes: 30,
      status: AppointmentStatus.CANCELLED,
    });

    await expect(
      AppointmentCancelService.cancel({
        appointmentId: appointment._id,
        cancelledById: patientId,
        cancelledByRole: "PATIENT",
        reason: "Too late",
      })
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("should fail if appointment is in the past", async () => {
    await createDoctor(doctorId, "cancel@test.com");

    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() - 60 * 60 * 1000),
      durationMinutes: 30,
      status: AppointmentStatus.SCHEDULED,
    });

    await expect(
      AppointmentCancelService.cancel({
        appointmentId: appointment._id,
        cancelledById: patientId,
        cancelledByRole: "PATIENT",
        reason: "Late",
      })
    ).rejects.toBeInstanceOf(HttpError);
  });
});
