import mongoose, { Types } from "mongoose";
import PrescriptionCreateService from "../../../src/services/prescription/prescription.create.service";
import { PrescriptionModel } from "../../../src/models/prescription";
import { AppointmentModel } from "../../../src/models/appointment";
import { DoctorModel } from "../../../src/models/doctor";
import { AppointmentStatus } from "../../../src/constants/status";
import { HttpError } from "../../../src/utils/response/http-error";

describe("PrescriptionCreateService.create", () => {
  const hospitalId = new Types.ObjectId();
  const doctorId = new Types.ObjectId();
  const patientId = new Types.ObjectId();

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterEach(async () => {
    await PrescriptionModel.deleteMany({});
    await AppointmentModel.deleteMany({});
    await DoctorModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  async function seedDoctor() {
    await DoctorModel.create({
      _id: doctorId,
      hospitalId,
      hospitalAdminId: new Types.ObjectId(),
      name: "Dr Rx",
      email: "rx@test.com",
      passwordHash: "hashed",
      specialization: "General",
    });
  }

  async function seedAppointment(status: AppointmentStatus) {
    return AppointmentModel.create({
      hospitalId,
      doctorId,
      patientId,
      scheduledAt: new Date(Date.now() - 30 * 60 * 1000),
      durationMinutes: 30,
      status,
    });
  }

  it("creates prescription for COMPLETED appointment", async () => {
    await seedDoctor();
    const appt = await seedAppointment(AppointmentStatus.COMPLETED);

    const rx = await PrescriptionCreateService.create({
      doctorId,
      hospitalId,
      appointmentId: appt._id,
      medicines: [{
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "2x",
        durationDays: 3,
      }],
      notes: "After meals",
    });

    expect(rx.appointmentId?.toString()).toBe(appt._id.toString());
  });

  it("fails if appointment not COMPLETED", async () => {
    await seedDoctor();
    const appt = await seedAppointment(AppointmentStatus.SCHEDULED);

    await expect(
      PrescriptionCreateService.create({
        doctorId,
        hospitalId,
        appointmentId: appt._id,
        medicines: [{
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "2x",
          durationDays: 3,
        }],
      })
    ).rejects.toBeInstanceOf(HttpError);
  });

  it("enforces one prescription per appointment", async () => {
    await seedDoctor();
    const appt = await seedAppointment(AppointmentStatus.COMPLETED);

    await PrescriptionCreateService.create({
      doctorId,
      hospitalId,
      appointmentId: appt._id,
      medicines: [{
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "2x",
        durationDays: 3,
      }],
    });

    await expect(
      PrescriptionCreateService.create({
        doctorId,
        hospitalId,
        appointmentId: appt._id,
        medicines: [{
          name: "Ibuprofen",
          dosage: "200mg",
          frequency: "1x",
          durationDays: 2,
        }],
      })
    ).rejects.toBeInstanceOf(HttpError);
  });
});
