import crypto from "crypto";
import { Types } from "mongoose";
import { RefreshTokenModel } from "../../../src/models/auth";

describe("RefreshToken Model", () => {
  beforeEach(async () => {
    // 🧹 ensure clean state between tests
    await RefreshTokenModel.deleteMany({});
  });

  it("should create a refresh token document", async () => {
    // 🔥 generate UNIQUE token every time
    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const userId = new Types.ObjectId();

    const doc = await RefreshTokenModel.create({
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    expect(doc).toBeDefined();
    expect(doc.userId.toString()).toBe(userId.toString());
    expect(doc.tokenHash).toBe(tokenHash);
    expect(doc.status).toBe("ACTIVE");
    expect(doc.expiresAt).toBeInstanceOf(Date);
  });
});
