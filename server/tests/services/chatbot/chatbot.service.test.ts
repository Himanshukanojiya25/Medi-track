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
  let adminId: string;
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
      name: "Chatbot Service Hospital",
      code: "BOT-SERVICE-HOSP",
      email: "bot@hospital.com",
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
      name: "Bot Admin",
      hospitalId,
      email: "bot-admin@hospital.com",
      passwordHash: "hashed-password",
    });
    adminId = admin._id.toString();

    const doctor = await DoctorModel.create({
      hospitalId,
      hospitalAdminId: adminId,
      name: "Dr Bot",
      email: "dr-bot@hospital.com",
      specialization: "General",
      passwordHash: "hashed-password",
    });
    doctorId = doctor._id.toString();

    const patient = await PatientModel.create({
      hospitalId,
      createdByHospitalAdminId: adminId,
      firstName: "Chat",
      lastName: "Patient",
      phone: "9888888888",
      passwordHash: "hashed-password",
    });
    patientId = patient._id.toString();

    await AppointmentModel.create({
      hospitalId,
      doctorId,
      patientId,
      scheduledAt: new Date(),
      durationMinutes: 30,
      createdByHospitalAdminId: adminId,
    });

    await PrescriptionModel.create({
      hospitalId,
      doctorId,
      patientId,
      medicines: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "2x",
          durationDays: 5,
        },
      ],
    });

    await BillingModel.create({
      hospitalId,
      patientId,
      invoiceNumber: "INV-CHAT-001",
      lineItems: [
        { description: "Consultation", quantity: 1, unitPrice: 500, amount: 500 },
      ],
      subTotal: 500,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: 500,
      paidAmount: 0,
      dueAmount: 500,
      createdByHospitalAdminId: adminId,
    });
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it("✅ should handle greeting intent", async () => {
    const result = await ChatbotService.handleQuery({
      role: "PATIENT",
      intent: "GREETING",
      userId: patientId,
    });

    expect(result).toHaveProperty("message");
  });

  it("✅ should return appointments for doctor", async () => {
    const result = await ChatbotService.handleQuery({
      role: "DOCTOR",
      intent: "APPOINTMENT_QUERY",
      userId: doctorId,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("✅ should return prescriptions for patient", async () => {
    const result = await ChatbotService.handleQuery({
      role: "PATIENT",
      intent: "PRESCRIPTION_QUERY",
      userId: patientId,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("✅ should return billings for hospital admin", async () => {
    const result = await ChatbotService.handleQuery({
      role: "HOSPITAL_ADMIN",
      intent: "BILLING_QUERY",
      userId: adminId,
      hospitalId,
    });

    expect(Array.isArray(result)).toBe(true);
  });

  it("❌ should throw error for invalid user id", async () => {
    await expect(
      ChatbotService.handleQuery({
        role: "PATIENT",
        intent: "PROFILE_QUERY",
        userId: "invalid-id",
      })
    ).rejects.toThrow("Invalid User ID");
  });
});
