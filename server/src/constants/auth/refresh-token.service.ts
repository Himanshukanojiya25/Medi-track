import jwt from "jsonwebtoken";
import { JwtPayload, LoginResponse } from "../../types/auth";
import { AUTH_ERROR_MESSAGES } from "../../constants/auth";
import { signAccessToken, signRefreshToken } from "../../utils/auth/jwt.util";

/**
 * Refresh Token Service
 * ---------------------
 * - Verifies refresh token
 * - Issues new access token
 * - Optionally rotates refresh token
 */
export async function refreshTokenService(
  refreshToken: string
): Promise<Pick<LoginResponse, "accessToken" | "refreshToken">> {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as JwtPayload;

    if (!decoded?.id || !decoded?.role) {
      throw new Error(AUTH_ERROR_MESSAGES.TOKEN_INVALID);
    }

    const payload: JwtPayload = {
      id: decoded.id,
      role: decoded.role,
      hospitalId: decoded.hospitalId,
    };

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload); // rotation (safe default)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    throw new Error(AUTH_ERROR_MESSAGES.UNAUTHORIZED);
  }
}
