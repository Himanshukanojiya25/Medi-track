import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import BillingService from "../../../src/services/billing/billing.service";
import { BillingModel } from "../../../src/models/billing";
import { HospitalModel } from "../../../src/models/hospital";
import { HospitalAdminModel } from "../../../src/models/hospital-admin";
import { DoctorModel } from "../../../src/models/doctor";
import { PatientModel } from "../../../src/models/patient";
import { AppointmentModel } from "../../../src/models/appointment";
import { BillingStatus } from "../../../src/constants/status"; // ✅ IMPORTANT

describe("Billing Service", () => {
  beforeAll(async () => {
    await connectDB();
    await BillingModel.deleteMany({});
    await AppointmentModel.deleteMany({});
    await HospitalModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await PatientModel.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDB();
  });

  let billingId: string;
  let hospitalId: string;
  let hospitalAdminId: string;
  let doctorId: string;
  let patientId: string;
  let appointmentId: string;

  it("should create hospital", async () => {
    const hospital = await HospitalModel.create({
      name: "Billing Test Hospital",
      code: "BILL-HOSP-001",
      email: "billing-hospital@test.com",
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
  });

  it("should create hospital admin", async () => {
    const admin = await HospitalAdminModel.create({
      name: "Billing Admin",
      hospitalId,
      email: "billing-admin@test.com",
      passwordHash: "hashed-password-123",
    });

    hospitalAdminId = admin._id.toString();
  });

  it("should create doctor", async () => {
    const doctor = await DoctorModel.create({
      hospitalId,
      hospitalAdminId,
      name: "Dr Billing",
      email: "dr-billing@test.com",
      phone: "8888888888",
      specialization: "General",
    });

    doctorId = doctor._id.toString();
  });

  it("should create patient", async () => {
    const patient = await PatientModel.create({
      hospitalId,
      createdByHospitalAdminId: hospitalAdminId,
      firstName: "Rohit",
      lastName: "Sharma",
      email: "billing-patient@test.com",
      phone: "7777777777",
      gender: "male",
      status: "active",
    });

    patientId = patient._id.toString();
  });

  it("should create appointment", async () => {
    const appointment = await AppointmentModel.create({
      hospitalId,
      hospitalAdminId,
      doctorId,
      patientId,
      scheduledAt: new Date(),
      durationMinutes: 30,
    });

    appointmentId = appointment._id.toString();
  });

  it("should create billing", async () => {
    const result = await BillingService.create({
      hospitalId,
      hospitalAdminId,
      patientId,
      appointmentId,

      invoiceNumber: "INV-001",

      subTotal: 1000,
      taxAmount: 100,
      discountAmount: 50,
      totalAmount: 1050,

      paidAmount: 0,
      dueAmount: 1050,

      currency: "INR",
      status: BillingStatus.ISSUED, // ✅ CORRECT
    });

    billingId = result._id.toString();
    expect(billingId).toBeDefined();
  });

  it("should get billing by id", async () => {
    const result = await BillingService.getById(billingId);
    expect(result).not.toBeNull();
  });

  it("should get all billings", async () => {
    const result = await BillingService.getAll();
    expect(result.length).toBeGreaterThan(0);
  });

  it("should get billings by hospital", async () => {
    const result = await BillingService.getByHospital(hospitalId);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should get billings by appointment", async () => {
    const result = await BillingService.getByAppointment(appointmentId);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should update billing", async () => {
    const result = await BillingService.updateById(billingId, {
      notes: "Updated billing notes",
    });

    expect(result).not.toBeNull();
  });

  it("should mark billing as paid", async () => {
    const result = await BillingService.markPaidById(billingId);
    expect(result?.status).toBe(BillingStatus.PAID); // ✅ FIX
  });

  it("should cancel billing", async () => {
    const result = await BillingService.cancelById(billingId);
    expect(result?.status).toBe(BillingStatus.CANCELLED); // ✅ FIX
  });

  it("should throw error for invalid id", async () => {
    await expect(
      BillingService.getById("invalid-id")
    ).rejects.toThrow("Invalid Billing ID");
  });
});
