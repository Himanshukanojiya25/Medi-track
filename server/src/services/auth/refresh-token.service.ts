import crypto from "crypto";
import jwt from "jsonwebtoken";
import { LoginResponse, JwtPayload } from "../../types/auth";
import { AUTH_ERROR_MESSAGES } from "../../constants/auth";
import {
  signAccessToken,
  signRefreshToken,
} from "../../utils/auth/jwt.util";
import { RefreshTokenModel } from "../../models/auth";

/**
 * Hash refresh token (DB never stores raw token)
 */
function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * =========================
 * 🔁 REFRESH TOKEN SERVICE
 * =========================
 * - verifies refresh JWT
 * - validates DB record
 * - revokes old token
 * - issues new access + refresh token (rotation)
 */
export async function refreshTokenService(
  refreshToken: string
): Promise<Pick<LoginResponse, "accessToken" | "refreshToken">> {
  try {
    /**
     * 1️⃣ Verify refresh JWT
     */
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as JwtPayload;

    if (!decoded?.id || !decoded?.role) {
      throw new Error(AUTH_ERROR_MESSAGES.TOKEN_INVALID);
    }

    /**
     * 2️⃣ Find active refresh token in DB
     */
    const tokenHash = hashToken(refreshToken);

    const storedToken = await RefreshTokenModel.findOne({
      tokenHash,
      status: "ACTIVE",
      expiresAt: { $gt: new Date() },
    });

    if (!storedToken) {
      throw new Error(AUTH_ERROR_MESSAGES.UNAUTHORIZED);
    }

    /**
     * 3️⃣ Revoke old refresh token
     */
    storedToken.status = "REVOKED";
    await storedToken.save();

    /**
     * 4️⃣ Issue new tokens
     */
    const payload: JwtPayload = {
      id: decoded.id,
      role: decoded.role,
      hospitalId: decoded.hospitalId,
    };

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    /**
     * 5️⃣ Persist new refresh token
     */
    await RefreshTokenModel.create({
      userId: decoded.id,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      ),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch {
    throw new Error(AUTH_ERROR_MESSAGES.UNAUTHORIZED);
  }
}
