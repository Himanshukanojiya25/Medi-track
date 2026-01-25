import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import PrescriptionService from "../../../src/services/prescription/prescription.service";

import { HospitalModel } from "../../../src/models/hospital";
import { HospitalAdminModel } from "../../../src/models/hospital-admin";
import { PatientModel } from "../../../src/models/patient";
import { DoctorModel } from "../../../src/models/doctor";
import { AppointmentModel } from "../../../src/models/appointment";
import { PrescriptionModel } from "../../../src/models/prescription";

import { PrescriptionStatus } from "../../../src/constants/status";

describe("Prescription Service", () => {
  let prescriptionId: string;
  let hospitalId: string;
  let adminId: string;
  let patientId: string;
  let doctorId: string;
  let appointmentId: string;

  beforeAll(async () => {
    await connectDB();

    const hospital = await HospitalModel.create({
      name: "RX Hospital",
      code: "RX-HOSP",
      email: "rx@hospital.com",
      phone: "9999999999",
      address: {
        line1: "Street",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });
    hospitalId = hospital._id.toString();

    const admin = await HospitalAdminModel.create({
      name: "Admin",
      hospitalId,
      email: "admin@rx.com",
      passwordHash: "hashed",
    });
    adminId = admin._id.toString();

    const patient = await PatientModel.create({
      hospitalId,
      createdByHospitalAdminId: adminId,
      firstName: "Test",
      lastName: "Patient",
      phone: "9000000000",
      passwordHash: "hashed",
    });
    patientId = patient._id.toString();

    const doctor = await DoctorModel.create({
      hospitalId,
      hospitalAdminId: adminId,
      name: "Dr Test",
      email: "dr@rx.com",
      specialization: "General",
      passwordHash: "hashed",
    });
    doctorId = doctor._id.toString();

    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(),
      durationMinutes: 30,
      createdByHospitalAdminId: adminId,
    });
    appointmentId = appointment._id.toString();

    const rx = await PrescriptionService.create({
      hospitalId,
      patientId,
      doctorId,
      appointmentId,
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

    prescriptionId = rx._id.toString();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it("should get prescription by id", async () => {
    const rx = await PrescriptionService.getById(prescriptionId);
    expect(rx).not.toBeNull();
  });

  it("should update prescription", async () => {
    await PrescriptionService.updateById(prescriptionId, {
      notes: "After meals",
    });

    const fresh = await PrescriptionModel.findById(prescriptionId).lean();
    expect(fresh?.notes).toBe("After meals");
  });

  it("should cancel prescription", async () => {
    await PrescriptionService.cancelById(prescriptionId);

    const fresh = await PrescriptionModel.findById(prescriptionId).lean();
    expect(fresh?.status).toBe(PrescriptionStatus.CANCELLED);
  });
});
