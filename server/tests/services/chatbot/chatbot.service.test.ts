import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import ChatbotService from "../../../src/services/ai/chatbot.service";

import { HospitalModel } from "../../../src/models/hospital";
import { HospitalAdminModel } from "../../../src/models/hospital-admin";
import { DoctorModel } from "../../../src/models/doctor";
import { PatientModel } from "../../../src/models/patient";
import { AppointmentModel } from "../../../src/models/appointment";
import { PrescriptionModel } from "../../../src/models/prescription";
import { BillingModel } from "../../../src/models/billing";

describe("Chatbot Service", () => {
  let hospitalId: string;
  let hospitalAdminId: string;
  let doctorId: string;
  let patientId: string;

  beforeAll(async () => {
    await connectDB();

    await BillingModel.deleteMany({});
    await PrescriptionModel.deleteMany({});
    await AppointmentModel.deleteMany({});
    await PatientModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await HospitalAdminModel.deleteMany({});
    await HospitalModel.deleteMany({});

    const hospital = await HospitalModel.create({
      name: "Chatbot Test Hospital",
      code: "CHATBOT-HOSP-001",
      email: "chatbot-hospital@test.com",
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

    const admin = await HospitalAdminModel.create({
      hospitalId,
      name: "Chatbot Admin",
      email: "chatbot-admin@test.com",
      passwordHash: "hashed-password",
    });
    hospitalAdminId = admin._id.toString();

    const doctor = await DoctorModel.create({
      hospitalId,
      hospitalAdminId,
      name: "Dr Chatbot",
      email: "dr-chatbot@test.com",
      phone: "8888888888",
      specialization: "General",
    });
    doctorId = doctor._id.toString();

    const patient = await PatientModel.create({
      hospitalId,
      createdByHospitalAdminId: hospitalAdminId,
      firstName: "Chat",
      lastName: "Patient",
      phone: "7777777777",
      gender: "male",
      status: "active",
    });
    patientId = patient._id.toString();

    await AppointmentModel.create({
      hospitalId,
      doctorId,
      patientId,
      scheduledAt: new Date(),
      durationMinutes: 30,
    });

    await PrescriptionModel.create({
      hospitalId,
      doctorId,
      patientId,
      medicines: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "Twice a day",
          durationDays: 5,
        },
      ],
      status: "active",
    });

    await BillingModel.create({
      hospitalId,
      patientId,
      invoiceNumber: "INV-CHATBOT-001",
      lineItems: [
        {
          description: "Consultation Fee",
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
      createdByHospitalAdminId: hospitalAdminId,
    });
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it("should handle greeting intent", async () => {
    const result = await ChatbotService.handleQuery({
      role: "PATIENT",
      intent: "GREETING",
      userId: patientId,
    });

    expect(result).toHaveProperty("message");
  });

  it("should return appointments for doctor", async () => {
    const result = await ChatbotService.handleQuery({
      role: "DOCTOR",
      intent: "APPOINTMENT_QUERY",
      userId: doctorId,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should return prescriptions for patient", async () => {
    const result = await ChatbotService.handleQuery({
      role: "PATIENT",
      intent: "PRESCRIPTION_QUERY",
      userId: patientId,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should return billings for hospital admin", async () => {
    const result = await ChatbotService.handleQuery({
      role: "HOSPITAL_ADMIN",
      intent: "BILLING_QUERY",
      userId: hospitalAdminId,
      hospitalId,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("should throw error for invalid user id", async () => {
    await expect(
      ChatbotService.handleQuery({
        role: "PATIENT",
        intent: "PROFILE_QUERY",
        userId: "invalid-id",
      })
    ).rejects.toThrow("Invalid User ID");
  });
});
