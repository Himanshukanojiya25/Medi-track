import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import AppointmentService from "../../../src/services/appointment/appointment.service";
import { AppointmentModel } from "../../../src/models/appointment";
import { HospitalModel } from "../../../src/models/hospital";
import { HospitalAdminModel } from "../../../src/models/hospital-admin";
import { DoctorModel } from "../../../src/models/doctor";
import { PatientModel } from "../../../src/models/patient";

describe("Appointment Service", () => {
  beforeAll(async () => {
    await connectDB();
    await AppointmentModel.deleteMany({});
    await HospitalModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await PatientModel.deleteMany({});
    // ❌ Do NOT delete HospitalAdminModel globally (other suites may depend)
  });

  afterAll(async () => {
    await disconnectDB();
  });

  let appointmentId: string;
  let hospitalId: string;
  let hospitalAdminId: string;
  let doctorId: string;
  let patientId: string;

  it("should create required hospital", async () => {
    const hospital = await HospitalModel.create({
      name: "Appointment Test Hospital",
      code: "APPT-HOSP-001",
      email: "appt-hospital@test.com",
      phone: "9999999999",
      address: {
        line1: "MG Road",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });

    hospitalId = hospital._id.toString();
    expect(hospitalId).toBeDefined();
  });

  it("should create hospital admin", async () => {
    const admin = await HospitalAdminModel.create({
      name: "Appointment Admin",
      hospitalId,
      email: "appt-admin@test.com",
      passwordHash: "hashed-password-123",
    });

    hospitalAdminId = admin._id.toString();
    expect(hospitalAdminId).toBeDefined();
  });

  it("should create doctor", async () => {
    const doctor = await DoctorModel.create({
      hospitalId,
      hospitalAdminId,
      name: "Dr Appointment",
      email: "dr-appt@test.com",
      phone: "8888888888",
      specialization: "General",
    });

    doctorId = doctor._id.toString();
    expect(doctorId).toBeDefined();
  });

  it("should create patient", async () => {
    const patient = await PatientModel.create({
      hospitalId,
      createdByHospitalAdminId: hospitalAdminId,
      firstName: "Amit",
      lastName: "Verma",
      email: "appt-patient@test.com",
      phone: "7777777777",
      gender: "male",
      status: "active",
    });

    patientId = patient._id.toString();
    expect(patientId).toBeDefined();
  });

  it("should create appointment", async () => {
    const result = await AppointmentService.create({
      hospitalId,
      hospitalAdminId,
      doctorId,
      patientId,
      scheduledAt: new Date(),
        durationMinutes: 45,
    });

    expect(result).toBeDefined();
    expect(result._id).toBeDefined();

    appointmentId = result._id.toString();
  });

  it("should get appointment by id", async () => {
    const result = await AppointmentService.getById(appointmentId);

    expect(result).not.toBeNull();
    expect(result?._id.toString()).toBe(appointmentId);
  });

  it("should get all appointments", async () => {
    const result = await AppointmentService.getAll();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should get appointments by hospital", async () => {
    const result = await AppointmentService.getByHospital(hospitalId);

    expect(result.length).toBeGreaterThan(0);
  });

  it("should get appointments by doctor", async () => {
    const result = await AppointmentService.getByDoctor(doctorId);

    expect(result.length).toBeGreaterThan(0);
  });

  it("should get appointments by patient", async () => {
    const result = await AppointmentService.getByPatient(patientId);

    expect(result.length).toBeGreaterThan(0);
  });

  it("should update appointment by id", async () => {
    const result = await AppointmentService.updateById(appointmentId, {
      notes: "Patient arrived late",
    });

    expect(result).not.toBeNull();
    expect(result?._id.toString()).toBe(appointmentId);
  });

  it("should cancel appointment", async () => {
    const result = await AppointmentService.cancelById(appointmentId);

    expect(result).not.toBeNull();
    expect(result?.status).toBe("CANCELLED");
  });

  it("should throw error for invalid id", async () => {
    await expect(
      AppointmentService.getById("invalid-id")
    ).rejects.toThrow("Invalid Appointment ID");
  });
});
