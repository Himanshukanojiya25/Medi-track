import mongoose, { Types } from "mongoose";
import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { AIAuditLog } from "../../../../src/models/ai/ai-audit-log";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    const db = mongoose.connection.db;
    if (db) {
      await db.dropDatabase();
    }
  }

  await disconnectDB();
});


describe("Schema Validation: AIAuditLog", () => {
  it("should create valid audit log", async () => {
    const log = await AIAuditLog.create({
      hospitalId: new Types.ObjectId(),
      actorRole: "system",
      action: "SESSION_CREATED",
    });

    expect(log.createdAt).toBeDefined();
  });

  it("should not allow update (immutable)", async () => {
    const log = await AIAuditLog.create({
      hospitalId: new Types.ObjectId(),
      actorRole: "system",
      action: "SESSION_CREATED",
    });

    await expect(
      AIAuditLog.updateOne(
        { _id: log._id },
        { action: "UPDATED" }
      )
    ).rejects.toThrow();
  });
});
