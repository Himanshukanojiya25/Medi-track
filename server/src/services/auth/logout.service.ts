import crypto from "crypto";
import { RefreshTokenModel } from "../../models/auth";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Logout from single device
 * - Revokes ONE refresh token
 */
export async function logoutService(refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);

  await RefreshTokenModel.findOneAndUpdate(
    { tokenHash, status: "ACTIVE" },
    { status: "REVOKED" }
  );
}

/**
 * Logout from all devices
 * - Revokes ALL active refresh tokens for user
 */
export async function logoutAllService(userId: string): Promise<void> {
  await RefreshTokenModel.updateMany(
    { userId, status: "ACTIVE" },
    { status: "REVOKED" }
  );
}
