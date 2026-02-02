import mongoose, { Types } from "mongoose";
import AppointmentBookService from "../../../src/services/appointment/appointment.book.service";
import { AppointmentModel } from "../../../src/models/appointment";
import { DoctorModel } from "../../../src/models/doctor";
import { DoctorAvailabilityModel } from "../../../src/models/doctor-availability";
import { AppointmentStatus } from "../../../src/constants/status";
import { HttpError } from "../../../src/utils/response/http-error";

describe("AppointmentBookService.book", () => {
  const hospitalId = new Types.ObjectId();
  const patientId = new Types.ObjectId();
  const doctorId = new Types.ObjectId();

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterEach(async () => {
    await AppointmentModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await DoctorAvailabilityModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 1); // tomorrow
  baseDate.setHours(10, 0, 0, 0); // 10:00 AM

  /**
   * 🔑 Helper: ALWAYS create a valid Doctor
   */
  async function createValidDoctor() {
    await DoctorModel.create({
      _id: doctorId,
      hospitalId,
      hospitalAdminId: new Types.ObjectId(),
      name: "Dr Booking Test",
      email: "booking@test.com",
      passwordHash: "hashed-password",
      specialization: "General",
    });
  }

  it("should book appointment successfully (happy path)", async () => {
    await createValidDoctor();

    await DoctorAvailabilityModel.create({
      doctorId,
      slotDurationMinutes: 30,
      weeklyAvailability: [
        {
          dayOfWeek: baseDate.getDay(),
          slots: [{ start: "09:00", end: "17:00" }],
        },
      ],
      isActive: true,
    });

    const appointment = await AppointmentBookService.book({
      patientId,
      doctorId,
      hospitalId,
      scheduledAt: baseDate,
      durationMinutes: 30,
      reason: "Fever",
    });

    expect(appointment).toBeDefined();
    expect(appointment.status).toBe(AppointmentStatus.SCHEDULED);
    expect(appointment.patientId.toString()).toBe(patientId.toString());
  });

  it("should fail if doctor does not exist", async () => {
    await expect(
      AppointmentBookService.book({
        patientId,
        doctorId,
        hospitalId,
        scheduledAt: baseDate,
        durationMinutes: 30,
      })
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("should fail if slot is outside availability", async () => {
    await createValidDoctor();

    await DoctorAvailabilityModel.create({
      doctorId,
      slotDurationMinutes: 30,
      weeklyAvailability: [
        {
          dayOfWeek: baseDate.getDay(),
          slots: [{ start: "12:00", end: "13:00" }],
        },
      ],
      isActive: true,
    });

    await expect(
      AppointmentBookService.book({
        patientId,
        doctorId,
        hospitalId,
        scheduledAt: baseDate, // 10 AM
        durationMinutes: 30,
      })
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("should fail on overlapping appointment", async () => {
    await createValidDoctor();

    await DoctorAvailabilityModel.create({
      doctorId,
      slotDurationMinutes: 30,
      weeklyAvailability: [
        {
          dayOfWeek: baseDate.getDay(),
          slots: [{ start: "09:00", end: "17:00" }],
        },
      ],
      isActive: true,
    });

    await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: baseDate,
      durationMinutes: 30,
      status: AppointmentStatus.SCHEDULED,
    });

    await expect(
      AppointmentBookService.book({
        patientId: new Types.ObjectId(),
        doctorId,
        hospitalId,
        scheduledAt: baseDate,
        durationMinutes: 30,
      })
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("should fail if booking in the past", async () => {
    await createValidDoctor();

    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 2);

    await expect(
      AppointmentBookService.book({
        patientId,
        doctorId,
        hospitalId,
        scheduledAt: pastDate,
        durationMinutes: 30,
      })
    ).rejects.toBeInstanceOf(HttpError);
  });
});
