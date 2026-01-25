import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { PrescriptionModel } from "../../../../src/models/prescription";

import {
  createHospital,
  createHospitalAdmin,
  createDoctor,
  createPatient,
  createAppointment,
} from "../../../helpers/factories";

describe("Prescription Relations", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await PrescriptionModel.deleteMany({});
    await disconnectDB();
  });

  it("should link prescription to hospital, doctor, patient & appointment", async () => {
    const hospital = await createHospital();
    const admin = await createHospitalAdmin(hospital._id);
    const doctor = await createDoctor(hospital._id, admin._id);
    const patient = await createPatient(hospital._id, admin._id);
    const appointment = await createAppointment(
      hospital._id,
      doctor._id,
      patient._id
    );

    const rx = await PrescriptionModel.create({
      hospitalId: hospital._id,
      doctorId: doctor._id,
      patientId: patient._id,
      appointmentId: appointment._id,
      medicines: [
        {
          name: "Ibuprofen",
          dosage: "200mg",
          frequency: "2x",
          durationDays: 3,
        },
      ],
    });

    const populated = await PrescriptionModel.findById(rx._id)
      .populate("hospitalId")
      .populate("doctorId")
      .populate("patientId")
      .populate("appointmentId");

    expect(populated?.hospitalId).toBeDefined();
    expect(populated?.doctorId).toBeDefined();
    expect(populated?.patientId).toBeDefined();
    expect(populated?.appointmentId).toBeDefined();
  });
});
