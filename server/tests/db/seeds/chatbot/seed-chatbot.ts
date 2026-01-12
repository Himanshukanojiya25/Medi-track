import { connectDB, disconnectDB } from "../../../../src/config";

import { ChatbotModel } from "../../../../src/models/chatbot";
import { HospitalModel } from "../../../../src/models/hospital";
import { DoctorModel } from "../../../../src/models/doctor";

import { ChatbotStatus } from "../../../../src/constants/status";

async function seedChatbot() {
  await connectDB();

  const hospital = await HospitalModel.findOne({});
  const doctor = await DoctorModel.findOne({});

  const exists = await ChatbotModel.findOne({
    model: "gpt-4",
    status: ChatbotStatus.SUCCESS,
  });

  if (!exists) {
    await ChatbotModel.create({
      hospitalId: hospital?._id,

      userId: doctor?._id,
      userRole: "doctor",

      doctorId: doctor?._id,

      prompt: "What is the dosage for paracetamol?",
      response: "Paracetamol 500mg can be taken twice a day after meals.",

      model: "gpt-4",

      promptTokens: 12,
      completionTokens: 18,
      totalTokens: 30,

      costUsd: 0.0021,

      latencyMs: 820,

      status: ChatbotStatus.SUCCESS,
    });

    console.log("✅ Chatbot log seeded");
  } else {
    console.log("ℹ️ Chatbot log already exists");
  }

  await disconnectDB();
}

seedChatbot()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
