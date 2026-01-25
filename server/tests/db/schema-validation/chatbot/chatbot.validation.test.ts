import { connectDB, disconnectDB } from "../../../../src/config/mongoose";

import { PrescriptionModel } from "../../../../src/models/prescription";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { PatientModel } from "../../../../src/models/patient";
import { DoctorModel } from "../../../../src/models/doctor";
import { AppointmentModel } from "../../../../src/models/appointment";

import { PrescriptionStatus } from "../../../../src/constants/status";

describe("Prescription Schema Validation (Chatbot)", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  async function createBasePrescription() {
    const hospital = await HospitalModel.create({
      name: "RX Hospital",
      code: `RX-${Date.now()}`,
      email: `rx${Date.now()}@hospital.com`,
      phone: "9999999999",
      address: {
        line1: "Street",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });

    const admin = await HospitalAdminModel.create({
      name: "Admin",
      hospitalId: hospital._id,
      email: `admin${Date.now()}@rx.com`,
      passwordHash: "hashed",
    });

    const patient = await PatientModel.create({
      hospitalId: hospital._id,
      createdByHospitalAdminId: admin._id,
      firstName: "Test",
      lastName: "Patient",
      phone: "9000000000",
      passwordHash: "hashed",
    });

    const doctor = await DoctorModel.create({
      hospitalId: hospital._id,
      hospitalAdminId: admin._id,
      name: "Dr Test",
      email: `dr${Date.now()}@rx.com`,
      specialization: "General",
      passwordHash: "hashed",
    });

    const appointment = await AppointmentModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      scheduledAt: new Date(),
      durationMinutes: 30,
      createdByHospitalAdminId: admin._id,
    });

    const rx = await PrescriptionModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      appointmentId: appointment._id,
      medicines: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "2x",
          durationDays: 3,
        },
      ],
      status: PrescriptionStatus.ACTIVE,
    });

    return rx._id;
  }

  it("should update prescription", async () => {
    const rxId = await createBasePrescription();

    await PrescriptionModel.findByIdAndUpdate(
      rxId,
      { $set: { notes: "After meals" } },
      { new: true }
    );

    const fresh = await PrescriptionModel.findById(rxId).lean();
    expect(fresh).not.toBeNull();
    expect(fresh?.notes).toBe("After meals");
  });

  it("should cancel prescription", async () => {
    const rxId = await createBasePrescription();

    await PrescriptionModel.findByIdAndUpdate(
      rxId,
      { $set: { status: PrescriptionStatus.CANCELLED } },
      { new: true }
    );

    const fresh = await PrescriptionModel.findById(rxId).lean();
    expect(fresh?.status).toBe(PrescriptionStatus.CANCELLED);
  });
});
