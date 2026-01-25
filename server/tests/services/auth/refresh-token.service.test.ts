import crypto from "crypto";
import { Types } from "mongoose";
import { refreshTokenService } from "../../../src/services/auth/refresh-token.service";
import { RefreshTokenModel } from "../../../src/models/auth";
import { signRefreshToken } from "../../../src/utils/auth/jwt.util";

describe("RefreshToken Service", () => {
  it("should rotate refresh token and revoke old one", async () => {
    const userId = new Types.ObjectId().toString();

    const payload = {
      id: userId,
      role: "PATIENT" as const,
    };

    const oldRefreshToken = signRefreshToken(payload);

    const oldTokenHash = crypto
      .createHash("sha256")
      .update(oldRefreshToken)
      .digest("hex");

    // 🔥 IMPORTANT FIX: push expiry clearly in future
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    await RefreshTokenModel.create({
      userId,
      tokenHash: oldTokenHash,
      status: "ACTIVE",
      expiresAt,
    });

    const result = await refreshTokenService(oldRefreshToken);

    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();

    const revoked = await RefreshTokenModel.findOne({
      tokenHash: oldTokenHash,
    });

    expect(revoked).not.toBeNull();
    expect(revoked?.status).toBe("REVOKED");
  });

  it("should reject reused refresh token", async () => {
    const userId = new Types.ObjectId().toString();

    const payload = {
      id: userId,
      role: "PATIENT" as const,
    };

    const refreshToken = signRefreshToken(payload);

    await expect(
      refreshTokenService(refreshToken)
    ).rejects.toThrow();
  });
});
