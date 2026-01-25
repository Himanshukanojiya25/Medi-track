import mongoose, { Types } from "mongoose";
import { connectDB, disconnectDB } from "../../../../src/config/mongoose";
import { AIAuditLogModel } from "../../../../src/models/ai/ai-audit-log";

describe("AI Audit Log Schema", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase();
    }
    await disconnectDB();
  });

  it("should create valid audit log", async () => {
    const log = await AIAuditLogModel.create({
      hospitalId: new Types.ObjectId(),
      actorRole: "system",
      action: "SESSION_CREATED",
    });

    expect(log.createdAt).toBeDefined();
  });

  it("should not allow update (immutable)", async () => {
    const log = await AIAuditLogModel.create({
      hospitalId: new Types.ObjectId(),
      actorRole: "system",
      action: "SESSION_CREATED",
    });

    await expect(
      AIAuditLogModel.updateOne(
        { _id: log._id },
        { action: "UPDATED" }
      )
    ).rejects.toThrow();
  });
});
