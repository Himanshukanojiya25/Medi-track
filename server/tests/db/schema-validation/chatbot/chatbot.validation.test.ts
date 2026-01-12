import { connectDB, disconnectDB } from "../../../../src/config";

import { ChatbotModel } from "../../../../src/models/chatbot";
import { HospitalModel } from "../../../../src/models/hospital";
import { DoctorModel } from "../../../../src/models/doctor";

import { ChatbotStatus } from "../../../../src/constants/status";

describe("Chatbot Schema Validation", () => {
  let hospitalId: any;
  let doctorId: any;

  beforeAll(async () => {
    await connectDB();

    // ✅ FULL VALID HOSPITAL
    const hospital = await HospitalModel.create({
      name: "Chatbot Schema Hospital",
      code: "BOT-SCHEMA",
      email: "bot-schema@hospital.com",
      phone: "9999997777",
      address: {
        line1: "Street",
        city: "Mumbai",
        state: "MH",
        country: "India",
        postalCode: "400001",
      },
    });

    hospitalId = hospital._id;

    const doctor = await DoctorModel.create({
      hospitalId,
      hospitalAdminId: hospitalId,
      name: "Dr Bot",
      email: "dr-bot@hospital.com",
      phone: "9333333333",
      specialization: "General",
    });

    doctorId = doctor._id;
  });

  afterAll(async () => {
    await ChatbotModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await HospitalModel.deleteMany({});
    await disconnectDB();
  });

  it("❌ should fail without required fields", async () => {
    await expect(ChatbotModel.create({})).rejects.toThrow();
  });

  it("❌ should reject invalid status", async () => {
    await expect(
      ChatbotModel.create({
        hospitalId,
        userId: doctorId,
        userRole: "doctor",
        doctorId,
        prompt: "Hi",
        response: "Hello",
        model: "gpt-4",
        promptTokens: 5,
        completionTokens: 5,
        totalTokens: 10,
        costUsd: 0.001,
        latencyMs: 200,
        status: "INVALID_STATUS",
      })
    ).rejects.toThrow();
  });

  it("❌ should reject negative token values", async () => {
    await expect(
      ChatbotModel.create({
        hospitalId,
        userId: doctorId,
        userRole: "doctor",
        doctorId,
        prompt: "Hi",
        response: "Hello",
        model: "gpt-4",
        promptTokens: -1,
        completionTokens: 5,
        totalTokens: 4,
        costUsd: 0.001,
        latencyMs: 200,
        status: ChatbotStatus.SUCCESS,
      })
    ).rejects.toThrow();
  });

  it("✅ should create chatbot log with valid data", async () => {
    const log = await ChatbotModel.create({
      hospitalId,
      userId: doctorId,
      userRole: "doctor",
      doctorId,
      prompt: "Hi",
      response: "Hello",
      model: "gpt-4",
      promptTokens: 5,
      completionTokens: 5,
      totalTokens: 10,
      costUsd: 0.001,
      latencyMs: 200,
      status: ChatbotStatus.SUCCESS,
    });

    expect(log).toBeDefined();
  });
});
