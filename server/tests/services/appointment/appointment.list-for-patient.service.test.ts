import mongoose, { Types } from "mongoose";
import AppointmentListForPatientService from "../../../src/services/appointment/appointment.list-for-patient.service";
import { AppointmentModel } from "../../../src/models/appointment";
import { DoctorModel } from "../../../src/models/doctor";
import { AppointmentStatus } from "../../../src/constants/status";

describe("AppointmentListForPatientService.list", () => {
  const hospitalId = new Types.ObjectId();
  const patientId = new Types.ObjectId();
  const otherPatientId = new Types.ObjectId();
  const doctorId = new Types.ObjectId();

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
      name: "Dr List Test",
      email: "list@test.com",
      passwordHash: "hashed-password",
      specialization: "General",
    });
  }

  it("should return ALL appointments for patient", async () => {
    await createDoctor();

    await AppointmentModel.create([
      {
        hospitalId,
        patientId,
        doctorId,
        scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
        durationMinutes: 30,
        status: AppointmentStatus.SCHEDULED,
      },
      {
        hospitalId,
        patientId,
        doctorId,
        scheduledAt: new Date(Date.now() - 60 * 60 * 1000),
        durationMinutes: 30,
        status: AppointmentStatus.CANCELLED,
      },
    ]);

    const result = await AppointmentListForPatientService.list({
      patientId,
    });

    expect(result).toHaveLength(2);
  });

  it("should return only UPCOMING appointments", async () => {
    await createDoctor();

    await AppointmentModel.create([
      {
        hospitalId,
        patientId,
        doctorId,
        scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
        durationMinutes: 30,
        status: AppointmentStatus.SCHEDULED,
      },
      {
        hospitalId,
        patientId,
        doctorId,
        scheduledAt: new Date(Date.now() - 60 * 60 * 1000),
        durationMinutes: 30,
        status: AppointmentStatus.CANCELLED,
      },
    ]);

    const result = await AppointmentListForPatientService.list({
      patientId,
      type: "UPCOMING",
    });

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe(AppointmentStatus.SCHEDULED);
  });

  it("should return only PAST appointments", async () => {
    await createDoctor();

    await AppointmentModel.create([
      {
        hospitalId,
        patientId,
        doctorId,
        scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
        durationMinutes: 30,
        status: AppointmentStatus.SCHEDULED,
      },
      {
        hospitalId,
        patientId,
        doctorId,
        scheduledAt: new Date(Date.now() - 60 * 60 * 1000),
        durationMinutes: 30,
        status: AppointmentStatus.CANCELLED,
      },
    ]);

    const result = await AppointmentListForPatientService.list({
      patientId,
      type: "PAST",
    });

    expect(result).toHaveLength(1);
    expect(result[0].status).toBe(AppointmentStatus.CANCELLED);
  });

  it("should not return appointments of other patients", async () => {
    await createDoctor();

    await AppointmentModel.create([
      {
        hospitalId,
        patientId,
        doctorId,
        scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
        durationMinutes: 30,
        status: AppointmentStatus.SCHEDULED,
      },
      {
        hospitalId,
        patientId: otherPatientId,
        doctorId,
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        durationMinutes: 30,
        status: AppointmentStatus.SCHEDULED,
      },
    ]);

    const result = await AppointmentListForPatientService.list({
      patientId,
    });

    expect(result).toHaveLength(1);
    expect(result[0].patientId.toString()).toBe(patientId.toString());
  });
});
