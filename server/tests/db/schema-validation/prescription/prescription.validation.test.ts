import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { PrescriptionModel } from "../../../../src/models/prescription";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { PatientModel } from "../../../../src/models/patient";
import { DoctorModel } from "../../../../src/models/doctor";
import { AppointmentModel } from "../../../../src/models/appointment";
import { PrescriptionStatus } from "../../../../src/constants/status";

describe("Prescription Schema Validation", () => {
  let hospitalId: string;
  let adminId: string;
  let patientId: string;
  let doctorId: string;
  let appointmentId: string;

  beforeAll(async () => {
    await connectDB();
    await PrescriptionModel.deleteMany({});
    await AppointmentModel.deleteMany({});
    await PatientModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await HospitalAdminModel.deleteMany({});
    await HospitalModel.deleteMany({});

    const hospital = await HospitalModel.create({
      name: "Prescription Schema Hospital",
      code: "RX-SCHEMA-HOSP",
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
      name: "Rx Admin",
      hospitalId,
      email: "rx-admin@hospital.com",
      passwordHash: "hashed-password",
    });
    adminId = admin._id.toString();

    const patient = await PatientModel.create({
      hospitalId,
      createdByHospitalAdminId: adminId,
      firstName: "Rx",
      lastName: "Patient",
      phone: "9111111111",
      passwordHash: "hashed-password",
    });
    patientId = patient._id.toString();

    const doctor = await DoctorModel.create({
      hospitalId,
      hospitalAdminId: adminId,
      name: "Dr Rx",
      email: "dr-rx@hospital.com",
      specialization: "General",
      passwordHash: "hashed-password",
    });
    doctorId = doctor._id.toString();

    const appointment = await AppointmentModel.create({
      hospitalId,
      patientId,
      doctorId,
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
      durationMinutes: 30,
      createdByHospitalAdminId: adminId,
    });
    appointmentId = appointment._id.toString();
  });

  afterAll(async () => {
    await PrescriptionModel.deleteMany({});
    await AppointmentModel.deleteMany({});
    await PatientModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await HospitalAdminModel.deleteMany({});
    await HospitalModel.deleteMany({});
    await disconnectDB();
  });

  it("❌ should fail without required fields", async () => {
    await expect(PrescriptionModel.create({})).rejects.toThrow();
  });

  it("❌ should reject empty medicines array", async () => {
    await expect(
      PrescriptionModel.create({
        hospitalId,
        patientId,
        doctorId,
        medicines: [],
      })
    ).rejects.toThrow();
  });

  it("❌ should reject invalid status", async () => {
    await expect(
      PrescriptionModel.create({
        hospitalId,
        patientId,
        doctorId,
        status: "INVALID_STATUS",
        medicines: [
          {
            name: "Paracetamol",
            dosage: "500mg",
            frequency: "2x",
            durationDays: 3,
          },
        ],
      })
    ).rejects.toThrow();
  });

  it("✅ should create prescription with valid data", async () => {
    const rx = await PrescriptionModel.create({
      hospitalId,
      patientId,
      doctorId,
      appointmentId,
      status: PrescriptionStatus.ACTIVE,
      medicines: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "2x",
          durationDays: 3,
        },
      ],
    });

    expect(rx).toBeDefined();
    expect(rx.status).toBe(PrescriptionStatus.ACTIVE);
  });
});
