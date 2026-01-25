import BillingService from "../../../src/services/billing/billing.service";
import { BillingStatus } from "../../../src/constants/status";
import { BillingModel } from "../../../src/models/billing";
import { HospitalModel } from "../../../src/models/hospital";
import { HospitalAdminModel } from "../../../src/models/hospital-admin";
import { PatientModel } from "../../../src/models/patient";
import { DoctorModel } from "../../../src/models/doctor";
import { AppointmentModel } from "../../../src/models/appointment";

describe("Billing Service", () => {
  let hospitalId: string;
  let adminId: string;
  let patientId: string;
  let doctorId: string;
  let appointmentId: string;

  beforeAll(async () => {
    const hospital = await HospitalModel.create({
      name: "Billing Service Hospital",
      code: "BILL-SERVICE-HOSP",
      email: "bill-service@hospital.com",
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
      email: "bill-admin@hospital.com",
      passwordHash: "hashed-password",
    });
    adminId = admin._id.toString();

    const patient = await PatientModel.create({
      hospitalId,
      createdByHospitalAdminId: adminId,
      firstName: "Billing",
      lastName: "Patient",
      phone: "9333333333",
      passwordHash: "hashed-password",
      gender: "male",
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
      scheduledAt: new Date(Date.now() + 3600000),
      durationMinutes: 30,
      createdByHospitalAdminId: adminId,
    });
    appointmentId = appointment._id.toString();
  });

  it("✅ should create billing", async () => {
    const billing = await BillingService.create({
      hospitalId,
      patientId,
      appointmentId,
      invoiceNumber: "INV-001",
      lineItems: [
        {
          description: "Consultation",
          quantity: 1,
          unitPrice: 600,
          amount: 600,
        },
      ],
      subTotal: 600,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 600,
      paidAmount: 0,
      dueAmount: 600,
      status: BillingStatus.ISSUED,
      createdByHospitalAdminId: adminId,
    });

    expect(billing).toBeDefined();
    expect(billing.status).toBe(BillingStatus.ISSUED);
  });

  it("✅ should mark billing as paid", async () => {
    const billing = await BillingModel.create({
      hospitalId,
      patientId,
      appointmentId,
      invoiceNumber: "INV-PAID",
      lineItems: [
        {
          description: "Consultation",
          quantity: 1,
          unitPrice: 500,
          amount: 500,
        },
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

    const updated = await BillingService.markPaidById(
      billing._id.toString()
    );

    expect(updated?.status).toBe(BillingStatus.PAID);
    expect(updated?.paidAmount).toBe(500);
    expect(updated?.dueAmount).toBe(0);
  });

  it("✅ should cancel billing", async () => {
    const billing = await BillingModel.create({
      hospitalId,
      patientId,
      appointmentId,
      invoiceNumber: "INV-CANCEL",
      lineItems: [
        {
          description: "Consultation",
          quantity: 1,
          unitPrice: 300,
          amount: 300,
        },
      ],
      subTotal: 300,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 300,
      paidAmount: 0,
      dueAmount: 300,
      status: BillingStatus.ISSUED,
      createdByHospitalAdminId: adminId,
    });

    const cancelled = await BillingService.cancelById(
      billing._id.toString()
    );

    expect(cancelled?.status).toBe(BillingStatus.CANCELLED);
  });

  it("❌ should throw error for invalid id", async () => {
    await expect(
      BillingService.getById("invalid-id")
    ).rejects.toThrow("Invalid Billing ID");
  });
});
