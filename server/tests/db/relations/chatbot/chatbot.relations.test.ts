import { connectDB, disconnectDB } from "../../../../src/config";

import { ChatbotModel } from "../../../../src/models/chatbot";
import { HospitalModel } from "../../../../src/models/hospital";
import { HospitalAdminModel } from "../../../../src/models/hospital-admin";
import { DoctorModel } from "../../../../src/models/doctor";
import { PatientModel } from "../../../../src/models/patient";
import { ChatbotStatus } from "../../../../src/constants/status";

describe("Chatbot Relations", () => {
  let hospital: any;
  let admin: any;
  let doctor: any;
  let patient: any;

  beforeAll(async () => {
    await connectDB();

    hospital = await HospitalModel.create({
      name: "Chatbot Hospital",
      code: "BOT-HOSP",
      email: "bot@hospital.com",
      phone: "9000002222",
      address: {
        line1: "Street",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400002",
      },
    });

    admin = await HospitalAdminModel.create({
      name: "Bot Admin",
      hospitalId: hospital._id,
      email: "bot-admin@hospital.com",
      passwordHash: "hashed",
      createdBy: hospital._id,
    });

    doctor = await DoctorModel.create({
      hospitalId: hospital._id,
      hospitalAdminId: admin._id,
      name: "Dr Bot",
      email: "dr-bot@hospital.com",
      phone: "9888880022",
      specialization: "General",
    });

    patient = await PatientModel.create({
      hospitalId: hospital._id,
      createdByHospitalAdminId: admin._id,
      firstName: "Bot",
      lastName: "Patient",
      phone: "9777770001",
    });
  });

  afterAll(async () => {
    await ChatbotModel.deleteMany({});
    await disconnectDB();
  });

  it("✅ should link chatbot log to hospital", async () => {
    const log = await ChatbotModel.create({
      hospitalId: hospital._id,
      userId: doctor._id,
      userRole: "doctor",
      doctorId: doctor._id,
      prompt: "Hello",
      response: "Hi",
      model: "gpt-4",
      promptTokens: 5,
      completionTokens: 5,
      totalTokens: 10,
      costUsd: 0.001,
      latencyMs: 300,
      status: ChatbotStatus.SUCCESS,
    });

    const populated = await ChatbotModel.findById(log._id).populate("hospitalId");
    expect(populated?.hospitalId).toBeDefined();
  });

  it("✅ should link chatbot log to doctor", async () => {
    const log = await ChatbotModel.create({
      hospitalId: hospital._id,
      userId: doctor._id,
      userRole: "doctor",
      doctorId: doctor._id,
      prompt: "Doctor Q",
      response: "Doctor A",
      model: "gpt-4",
      promptTokens: 6,
      completionTokens: 6,
      totalTokens: 12,
      costUsd: 0.0012,
      latencyMs: 280,
      status: ChatbotStatus.SUCCESS,
    });

    const populated = await ChatbotModel.findById(log._id).populate("doctorId");
    expect(populated?.doctorId).toBeDefined();
  });

  it("✅ should link chatbot log to patient (optional)", async () => {
    const log = await ChatbotModel.create({
      hospitalId: hospital._id,
      userId: patient._id,
      userRole: "patient",
      patientId: patient._id,
      prompt: "Patient Q",
      response: "Patient A",
      model: "gpt-4",
      promptTokens: 7,
      completionTokens: 7,
      totalTokens: 14,
      costUsd: 0.0014,
      latencyMs: 320,
      status: ChatbotStatus.SUCCESS,
    });

    const populated = await ChatbotModel.findById(log._id).populate("patientId");
    expect(populated?.patientId).toBeDefined();
  });
});
