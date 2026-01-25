import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { ChatbotModel } from "../../../../src/models/chatbot";
import { ChatbotStatus } from "../../../../src/constants/status";

import {
  createHospital,
  createHospitalAdmin,
  createDoctor,
  createPatient,
} from "../../../helpers/factories";

describe("Chatbot Relations", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await ChatbotModel.deleteMany({});
    await disconnectDB();
  });

  it("should link chatbot log to hospital, doctor & patient", async () => {
    const hospital = await createHospital();
    const admin = await createHospitalAdmin(hospital._id);
    const doctor = await createDoctor(hospital._id, admin._id);
    const patient = await createPatient(hospital._id, admin._id);

    const log = await ChatbotModel.create({
      hospitalId: hospital._id,
      userId: doctor._id,
      userRole: "doctor",
      doctorId: doctor._id,
      patientId: patient._id,
      prompt: "Hello",
      response: "Hi",
      model: "gpt-4",
      promptTokens: 5,
      completionTokens: 5,
      totalTokens: 10,
      costUsd: 0.001,
      latencyMs: 200,
      status: ChatbotStatus.SUCCESS,
    });

    const populated = await ChatbotModel.findById(log._id)
      .populate("hospitalId")
      .populate("doctorId")
      .populate("patientId");

    expect(populated?.hospitalId).toBeDefined();
    expect(populated?.doctorId).toBeDefined();
    expect(populated?.patientId).toBeDefined();
  });
});
