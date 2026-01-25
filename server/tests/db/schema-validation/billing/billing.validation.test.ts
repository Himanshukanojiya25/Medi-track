import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { BillingModel } from "../../../../src/models/billing";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { PatientModel } from "../../../../src/models/patient";
import { AppointmentModel } from "../../../../src/models/appointment";
import { DoctorModel } from "../../../../src/models/doctor";
import { BillingStatus } from "../../../../src/constants/status";

describe("Billing Schema Validation", () => {
  let hospitalId: string;
  let adminId: string;
  let patientId: string;
  let doctorId: string;
  let appointmentId: string;

  beforeAll(async () => {
    await connectDB();
    await BillingModel.deleteMany({});
    await AppointmentModel.deleteMany({});
    await PatientModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await HospitalAdminModel.deleteMany({});
    await HospitalModel.deleteMany({});

    const hospital = await HospitalModel.create({
      name: "Billing Schema Hospital",
      code: "BILL-SCHEMA-HOSP",
      email: "bill@hospital.com",
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
      name: "Billing Admin",
      hospitalId,
      email: "billing-admin@hospital.com",
      passwordHash: "hashed-password",
    });
    adminId = admin._id.toString();

    const patient = await PatientModel.create({
      hospitalId,
      createdByHospitalAdminId: adminId,
      firstName: "Billing",
      lastName: "Patient",
      phone: "9111111111",
      passwordHash: "hashed-password",
    });
    patientId = patient._id.toString();

    const doctor = await DoctorModel.create({
      hospitalId,
      hospitalAdminId: adminId,
      name: "Dr Billing",
      email: "dr-billing@hospital.com",
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
    await BillingModel.deleteMany({});
    await AppointmentModel.deleteMany({});
    await PatientModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await HospitalAdminModel.deleteMany({});
    await HospitalModel.deleteMany({});
    await disconnectDB();
  });

  it("❌ should fail without required fields", async () => {
    await expect(BillingModel.create({})).rejects.toThrow();
  });

  it("❌ should reject negative amounts", async () => {
    await expect(
      BillingModel.create({
        hospitalId,
        patientId,
        invoiceNumber: "INV-NEG-001",
        lineItems: [
          { description: "Test", quantity: 1, unitPrice: -100, amount: -100 },
        ],
        subTotal: -100,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: -100,
        paidAmount: 0,
        dueAmount: -100,
      })
    ).rejects.toThrow();
  });

  it("❌ should reject invalid status", async () => {
    await expect(
      BillingModel.create({
        hospitalId,
        patientId,
        invoiceNumber: "INV-STATUS-001",
        lineItems: [
          { description: "Test", quantity: 1, unitPrice: 100, amount: 100 },
        ],
        subTotal: 100,
        taxAmount: 0,
        discountAmount: 0,
        totalAmount: 100,
        paidAmount: 0,
        dueAmount: 100,
        status: "INVALID_STATUS",
      })
    ).rejects.toThrow();
  });

  it("✅ should create billing with valid data", async () => {
    const billing = await BillingModel.create({
      hospitalId,
      patientId,
      appointmentId,
      invoiceNumber: "INV-VALID-001",
      lineItems: [
        { description: "Consultation", quantity: 1, unitPrice: 500, amount: 500 },
      ],
      subTotal: 500,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 500,
      paidAmount: 0,
      dueAmount: 500,
      status: BillingStatus.ISSUED,
      createdByHospitalAdminId: adminId,
    });

    expect(billing).toBeDefined();
    expect(billing.status).toBe(BillingStatus.ISSUED);
  });
});
