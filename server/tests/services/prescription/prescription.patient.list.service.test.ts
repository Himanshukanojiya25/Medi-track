import mongoose, { Types } from "mongoose";
import PrescriptionPatientListService from "../../../src/services/prescription/prescription.patient.list.service";
import { PrescriptionModel } from "../../../src/models/prescription";

describe("PrescriptionPatientListService.list", () => {
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

  it("lists prescriptions for patient", async () => {
    await PrescriptionModel.create({
      hospitalId: new Types.ObjectId(),
      doctorId: new Types.ObjectId(),
      patientId,
      appointmentId: new Types.ObjectId(),
      medicines: [{
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "2x",
        durationDays: 3,
      }],
    });

    const list = await PrescriptionPatientListService.list(patientId);
    expect(list.length).toBe(1);
  });
});
