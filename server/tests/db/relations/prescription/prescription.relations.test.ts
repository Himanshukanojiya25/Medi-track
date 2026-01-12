import { connectDB, disconnectDB } from "../../../../src/config";

import { PrescriptionModel } from "../../../../src/models/prescription";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { PatientModel } from "../../../../src/models/patient";
import { DoctorModel } from "../../../../src/models/doctor";
import { AppointmentModel } from "../../../../src/models/appointment";
import { PrescriptionStatus } from "../../../../src/constants/status";

describe("Prescription Relations", () => {
  let hospital: any;
  let admin: any;
  let patient: any;
  let doctor: any;
  let appointment: any;

  beforeAll(async () => {
    await connectDB();

    hospital = await HospitalModel.create({
      name: "Prescription Hospital",
      code: "RX-HOSP",
      email: "rx@hospital.com",
      phone: "9000004444",
      address: {
        line1: "Street",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400004",
      },
    });

    admin = await HospitalAdminModel.create({
      name: "Rx Admin",
      hospitalId: hospital._id,
      email: "rx-admin@hospital.com",
      passwordHash: "hashed",
      createdBy: hospital._id,
    });

    patient = await PatientModel.create({
      hospitalId: hospital._id,
      createdByHospitalAdminId: admin._id,
      firstName: "Rel",
      lastName: "Rx",
      phone: "9999990001",
    });

    doctor = await DoctorModel.create({
      hospitalId: hospital._id,
      hospitalAdminId: admin._id,
      name: "Dr Rel Rx",
      email: "dr-rel-rx@hospital.com",
      phone: "9999990002",
      specialization: "General",
    });

    appointment = await AppointmentModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      scheduledAt: new Date(),
      durationMinutes: 30,
      createdByHospitalAdminId: admin._id,
    });
  });

  afterAll(async () => {
    await PrescriptionModel.deleteMany({});
    await disconnectDB();
  });

  it("✅ should link prescription to hospital", async () => {
    const rx = await PrescriptionModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      status: PrescriptionStatus.COMPLETED,
      medicines: [{ name: "Ibuprofen", dosage: "200mg", frequency: "2x", durationDays: 3 }],
    });

    const populated = await PrescriptionModel.findById(rx._id).populate("hospitalId");
    expect(populated?.hospitalId).toBeDefined();
  });

  it("✅ should link prescription to patient", async () => {
    const rx = await PrescriptionModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      status: PrescriptionStatus.COMPLETED,
      medicines: [{ name: "Ibuprofen", dosage: "200mg", frequency: "2x", durationDays: 3 }],
    });

    const populated = await PrescriptionModel.findById(rx._id).populate("patientId");
    expect(populated?.patientId).toBeDefined();
  });

  it("✅ should link prescription to doctor", async () => {
    const rx = await PrescriptionModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      status: PrescriptionStatus.COMPLETED,
      medicines: [{ name: "Ibuprofen", dosage: "200mg", frequency: "2x", durationDays: 3 }],
    });

    const populated = await PrescriptionModel.findById(rx._id).populate("doctorId");
    expect(populated?.doctorId).toBeDefined();
  });

  it("✅ should link prescription to appointment (optional)", async () => {
    const rx = await PrescriptionModel.create({
      hospitalId: hospital._id,
      patientId: patient._id,
      doctorId: doctor._id,
      appointmentId: appointment._id,
      status: PrescriptionStatus.COMPLETED,
      medicines: [{ name: "Ibuprofen", dosage: "200mg", frequency: "2x", durationDays: 3 }],
    });

    const populated = await PrescriptionModel.findById(rx._id).populate("appointmentId");
    expect(populated?.appointmentId).toBeDefined();
  });
});
