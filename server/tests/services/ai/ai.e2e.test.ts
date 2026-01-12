/// <reference types="jest" />
// tests/services/ai/ai.e2e.test.ts

import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import {
  ChatSessionService,
  ChatOrchestratorService,
} from "../../../src/services/ai";

import { connectDB, disconnectDB } from "../../../src/config/mongoose";
import { ENV } from "../../../src/config/env";

/**
 * TEMP DISABLED:
 * This test hits real AI engine (OpenAI).
 * Once OpenAI billing / mock provider is enabled,
 * just remove `.skip` and test will work again.
 */
describe.skip("AI Services E2E Flow", () => {
  let mongo: MongoMemoryServer;

  const sessionService = new ChatSessionService();
  const orchestrator = new ChatOrchestratorService();

  const userId = new mongoose.Types.ObjectId().toString();
  const hospitalId = new mongoose.Types.ObjectId().toString();

  beforeAll(async () => {
    // 1️⃣ Start in-memory MongoDB
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    // 2️⃣ Override ENV mongo uri ONLY for tests
    (process.env as any).MONGO_URI = uri;

    // 3️⃣ Connect using your real DB connector
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
    await mongo.stop();
  });

  afterEach(async () => {
    // Clean DB between tests
    const collections = mongoose.connection.collections;
    for (const key of Object.keys(collections)) {
      await collections[key].deleteMany({});
    }
  });

  it("should complete full AI chat lifecycle (PATIENT)", async () => {
    const session = await sessionService.startSession({
      role: "patient",
      userId,
      hospitalId,
    });

    expect(session).toBeDefined();
    expect(session.status).toBe("active");

    const response = await orchestrator.handleMessage({
      sessionId: session.id,
      userId,
      role: "patient",
      message: "Meri last visit me kya hua tha?",
      language: "hi",
      hospitalId,
    });

    expect(response.reply).toBeDefined();
    expect(response.tokensUsed).toBeGreaterThan(0);

    await sessionService.closeSession(session.id, userId);

    await expect(
      orchestrator.handleMessage({
        sessionId: session.id,
        userId,
        role: "patient",
        message: "Hello?",
        language: "en",
        hospitalId,
      })
    ).rejects.toThrow();
  });

  it("should block hospital mismatch access", async () => {
    const otherHospitalId =
      new mongoose.Types.ObjectId().toString();

    const session = await sessionService.startSession({
      role: "doctor",
      userId,
      hospitalId,
    });

    await expect(
      orchestrator.handleMessage({
        sessionId: session.id,
        userId,
        role: "doctor",
        message: "Patient summary do",
        language: "en",
        hospitalId: otherHospitalId,
      })
    ).rejects.toThrow("Hospital context mismatch");
  });
});
