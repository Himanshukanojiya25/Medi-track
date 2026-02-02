import mongoose, { Types } from "mongoose";
import DoctorAppointmentsService from "../../../src/services/doctor/doctor.appointments.service";
import { AppointmentModel } from "../../../src/models/appointment";
import { DoctorModel } from "../../../src/models/doctor";
import { AppointmentStatus } from "../../../src/constants/status";

describe("DoctorAppointmentsService.list", () => {
  const hospitalId = new Types.ObjectId();
  const doctorId = new Types.ObjectId();
  const patientId = new Types.ObjectId();

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

  async function createDoctor() {
    await DoctorModel.create({
      _id: doctorId,
      hospitalId,
      hospitalAdminId: new Types.ObjectId(),
      name: "Dr Dashboard",
      email: "dashboard@test.com",
      passwordHash: "hashed-password",
      specialization: "General",
    });
  }

  async function createAppointment(
    dateOffsetMinutes: number,
    status: AppointmentStatus
  ) {
    return AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() + dateOffsetMinutes * 60 * 1000),
      durationMinutes: 30,
      status,
    });
  }

  it("should list all appointments for doctor", async () => {
    await createDoctor();

    await createAppointment(-120, AppointmentStatus.COMPLETED);
    await createAppointment(60, AppointmentStatus.SCHEDULED);

    const result = await DoctorAppointmentsService.list({ doctorId });

    expect(result.length).toBe(2);
  });

  it("should list today's appointments", async () => {
    await createDoctor();

    await createAppointment(30, AppointmentStatus.SCHEDULED);

    const result = await DoctorAppointmentsService.list({
      doctorId,
      date: "today",
    });

    expect(result.length).toBe(1);
  });

  it("should list upcoming appointments", async () => {
    await createDoctor();

    await createAppointment(120, AppointmentStatus.SCHEDULED);

    const result = await DoctorAppointmentsService.list({
      doctorId,
      date: "upcoming",
    });

    expect(result.length).toBe(1);
  });

  it("should list past appointments", async () => {
    await createDoctor();

    await createAppointment(-120, AppointmentStatus.COMPLETED);

    const result = await DoctorAppointmentsService.list({
      doctorId,
      date: "past",
    });

    expect(result.length).toBe(1);
  });

  it("should filter by status", async () => {
    await createDoctor();

    await createAppointment(-120, AppointmentStatus.COMPLETED);
    await createAppointment(60, AppointmentStatus.SCHEDULED);

    const result = await DoctorAppointmentsService.list({
      doctorId,
      status: AppointmentStatus.COMPLETED,
    });

    expect(result.length).toBe(1);
    expect(result[0].status).toBe(AppointmentStatus.COMPLETED);
  });

  it("should apply date range filter", async () => {
    await createDoctor();

    const from = new Date(Date.now() - 60 * 60 * 1000);
    const to = new Date(Date.now() + 60 * 60 * 1000);

    await createAppointment(30, AppointmentStatus.SCHEDULED);
    await createAppointment(300, AppointmentStatus.SCHEDULED);

    const result = await DoctorAppointmentsService.list({
      doctorId,
      from,
      to,
    });

    expect(result.length).toBe(1);
  });
});
