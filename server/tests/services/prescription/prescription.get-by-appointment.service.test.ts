import mongoose, { Types } from "mongoose";
import PrescriptionGetByAppointmentService from "../../../src/services/prescription/prescription.get-by-appointment.service";
import { PrescriptionModel } from "../../../src/models/prescription";
import { HttpError } from "../../../src/utils/response/http-error";

describe("PrescriptionGetByAppointmentService.get", () => {
  const appointmentId = new Types.ObjectId();
  const doctorId = new Types.ObjectId();
  const patientId = new Types.ObjectId();

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  afterEach(async () => {
    await PrescriptionModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("allows doctor (own) access", async () => {
    await PrescriptionModel.create({
      hospitalId: new Types.ObjectId(),
      doctorId,
      patientId,
      appointmentId,
      medicines: [{
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "2x",
        durationDays: 3,
      }],
    });

    const rx = await PrescriptionGetByAppointmentService.get({
      appointmentId,
      requesterId: doctorId,
      role: "DOCTOR",
    });

    expect(rx.appointmentId?.toString()).toBe(appointmentId.toString());
  });

  it("denies wrong patient", async () => {
    await PrescriptionModel.create({
      hospitalId: new Types.ObjectId(),
      doctorId,
      patientId,
      appointmentId,
      medicines: [{
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "2x",
        durationDays: 3,
      }],
    });

    await expect(
      PrescriptionGetByAppointmentService.get({
        appointmentId,
        requesterId: new Types.ObjectId(),
        role: "PATIENT",
      })
    ).rejects.toBeInstanceOf(HttpError);
  });
});
